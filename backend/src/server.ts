import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();
const JWT_SECRET = process.env.JWT_SECRET!;

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const port = 3005;

function generateToken(id: number) {
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
  return token;
}

function verifyToken(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET);
  // @ts-ignore
  return decoded.id;
}

async function getCurrentUser(token: string) {
  const decoded = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded },
    // @ts-ignore
    include: { reviews: true, reservations: true, restaurants: true },
  });

  return user;
}

//This endpoint will sign up the user
app.post("/sign-up", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      const hashedPassword = bcrypt.hashSync(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = generateToken(user.id);

      res.send({ user, token });
    }
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will sign in the user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { reviews: true, restaurants: true, reservations: true },
    });

    if (!user) {
      return res.status(400).send({ error: "Invalid credentials." });
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = generateToken(user.id);

    res.send({ user, token });
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get/validate the current user
app.get("/validate", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).send({ error: "You are not signed in!" });
    } else {
      const user = await getCurrentUser(token);
      if (user) {
        res.send({ user, token: generateToken(user.id) });
      } else {
        res.status(400).send({ error: "Please try to sign in again!" });
      }
    }
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all the restaurants
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { reviews: true, reservations: true },
    });
    res.send(restaurants);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get a restaurant by id
app.get("/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: { reviews: true, reservations: true, menu: true, images: true },
    });
    res.send(restaurant);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

app.patch("/restaurants/:id/patch", async (req, res) => {
  try {
    // @ts-ignore
    const restaurant = await prisma.restaurant.update({
      where: { id: Number(req.params.id) },
      data: {
        // @ts-ignore
        name: req.body.name
      },
      include: { reviews: true, reservations: true, images: true },
    });

    res.send(restaurant);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all the reviews for a restaurant by id
app.get("/restaurants/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { restaurantId: Number(id) },
      include: { user: true },
    });
    res.send(reviews);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});
//This end point creates a review!!...
app.post("/user/reviews", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(400).send({ error: ["Token not provided"] });
      return;
    }
    const user = await getCurrentUser(token);
    if (!user) {
      res.status(404).send({ error: ["User not found"] });
      return;
    }
    let data = {
      review: req.body.review,
      rating: req.body.rating,
      restaurantId: req.body.restaurantId,
      userId: user.id,
    };
    let errors: string[] = [];
    if (typeof data.review !== "string") {
      errors.push("Review not provided or not a string");
    }
    if (typeof data.rating !== "number") {
      errors.push("Rating not provided or not a number");
    }
    if (typeof data.restaurantId !== "number") {
      errors.push("Restaurnat id not provided or not a number");
    }
    if (typeof data.userId !== "number") {
      errors.push("User id not provided or not a number");
    }
    if (errors.length === 0) {
      const review = await prisma.review.create({
        data: {
          rating: data.rating,
          review: data.review,
          restaurantId: data.restaurantId,
          userId: data.userId,
        },
        include: { user: true },
      });
      res.send(review);
    } else {
      res.status(400).send({ errors });
    }
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ errors: [error.message] });
  }
});
//This endpoint will get all the reservations for a restaurant by id
app.get("/restaurants/:id/reservations", async (req, res) => {
  try {
    const { id } = req.params;
    const reservations = await prisma.reservation.findMany({
      where: { restaurantId: Number(id) },
      include: { claimedBy: true },
    });
    res.send(reservations);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all the menu items for a restaurant by id
app.get("/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await prisma.menuItem.findMany({
      where: { restaurantId: Number(id) },
    });
    res.send(menu);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

app.get("/users/:id/restaurant", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findFirst({
      where: { managerId: Number(id) },
      include: { reviews: true, reservations: true, images: true },
    });
    res.send(restaurant);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { reviews: true, reservations: true },
    });
    res.send(users);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      // @ts-ignore
      include: { reviews: true, reservations: true },
    });
    res.send(user);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all reservations for a user by id
app.get("/users/:id/reservations", async (req, res) => {
  try {
    const { id } = req.params;
    const reservations = await prisma.reservation.findMany({
      where: { userId: Number(id) },
      include: { restaurant: true },
    });
    res.send(reservations);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all restaurants that are located in a city
app.get("/restaurants/city/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const restaurants = await prisma.restaurant.findMany({
      where: { city: { contains: city } },
      include: { reviews: true, reservations: true },
    });
    res.send(restaurants);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all restaurants by cuisine
app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const { cuisine } = req.params;
    const restaurants = await prisma.restaurant.findMany({
      where: { cuisineInfo: { contains: cuisine } },
      include: { reviews: true, reservations: true },
    });
    res.send(restaurants);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all restaurants by name
app.get("/restaurants/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const restaurants = await prisma.restaurant.findMany({
      where: { name: { contains: name } },
      include: { reviews: true, reservations: true },
    });
    res.send(restaurants);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint will get all restaurants that are located in a city or have a certain name or cuisine
app.get("/restaurants/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const restaurants = await prisma.restaurant.findMany({
      where: {
        OR: [
          { city: { contains: searchTerm } },
          { name: { contains: searchTerm } },
          { cuisineInfo: { contains: searchTerm } },
        ],
      },
      include: { reviews: true, reservations: true },
    });
    res.send(restaurants);
  } catch (error) {
    // @ts-ignore
    res.status(500).send({ error: error.message });
  }
});

//This endpoint deletes a reservation by id
app.delete("/reservation/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).send({ errors: ["Id not provided"] });
      return;
    }
    const reservation = await prisma.reservation.delete({ where: { id } });
    res.send(`Reservation ${reservation.id} deleted succssesfully!`);
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ errors: [error.message] });
  }
});
//This endpoint  chnages the restaurants name by id
app.patch("/change-restaurants-name/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).send({ errors: ["Restaurant id not provided"] });
      return;
    }
    const errors: string[] = [];
    const name = req.body.name;
    if (typeof name !== "string") {
      errors.push("Name not provided or not a string");
    }
    if (errors.length === 0) {
      const restaurant = await prisma.restaurant.update({
        where: { id },
        data: {
          name,
        },
      });
      res.send(restaurant);
    } else {
      res.status(400).send({ errors });
    }
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ errors: [error.message] });
  }
});
//This endpoint creates a new image by restaurant id
app.post("/image/:restaurantId", async (req, res) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    if (!restaurantId) {
      res.status(400).send({ errors: ["Id not provided"] });
      return;
    }

    const errors: string[] = [];
    const url = req.body.url;
    if (typeof url !== "string") {
      errors.push("Url not provided or not a string");
    }
    if (errors.length === 0) {
      const image = await prisma.image.create({
        data: {
          restaurantId,
          url: req.body.url,
        },
      });
      res.send(image);
    } else {
      res.status(400).send({ errors });
    }
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ errors: [error.message] });
  }
});

//This endpoint creates a reservation for the specified user and restaurant
app.post("/reservation/:userId/:restaurantId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const restaurantId = Number(req.params.restaurantId);
    if (!userId || !restaurantId) {
      res.status(400).send({ errors: ["User or restaurant not provided"] });
      return;
    }

    const errors: string[] = [];
    const date = req.body.date;
    if (typeof date !== "string") {
      errors.push("Date not provided!");
    }
    if (date === "") {
      errors.push("Date not provided!");
    }
    const time = req.body.time;
    if (typeof time !== "string") {
      errors.push("Time not provided!");
    }
    if (time === "") {
      errors.push("Time not provided!");
    }
    if (errors.length === 0) {
      const reservation = await prisma.reservation.create({
        data: {
          userId,
          restaurantId,
          date,
          time,
        },
      });
      res.send(reservation);
    } else {
      res.status(400).send({ errors });
    }
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ errors: [error.message] });
  }
});

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
