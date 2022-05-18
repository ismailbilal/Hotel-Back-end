import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findByUsername = async (username) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:User {username: '${username}'}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const findByEmail = async (email) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:User {email: '${email}'}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const findAll = async () => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`MATCH (n:User) RETURN n`);
  session.close();
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:User {_id: "${id}"}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const create = async (obj) => {
  if (await findByUsername(obj.username)) {
    return { message: "username exist" };
  }
  if (await findByEmail(obj.email)) {
    return { message: "email exist" };
  }
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MERGE (n:User {username:"${obj.username}"}) 
    ON CREATE SET n._id= "${nanoid(8)}",
    n.email = "${obj.email}",
    n.password = "${obj.password}"
    RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:User {_id: "${id}"})
    SET n.firstname = "${obj.firstname}",
    n.lastname = "${obj.lastname}",
    n.email = "${obj.email}"
    RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const changePassword = async (id, password) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:User {_id: "${id}"})
    SET n.password = "${password}"
    RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  const session = driver.session({ DATABASE });
  await session.run(`MATCH (n:User {_id: "${id}"}) DETACH DELETE n`);
  session.close();
  return await findAll();
};

const createRelationshipHasVisit = async (userId, hotelId) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (u:User {_id: "${userId}"}), (h:Hotel {_id: "${hotelId}"})
    MERGE (u)-[v:HAS_VISITE]->(h)
    RETURN u, v, h`
  );
  session.close();
  return result.records[0];
};

const getHotelsVisited = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (u:User {_id: "${id}"})-[:HAS_VISITE]->(h:Hotel)
    RETURN h`
  );
  session.close();
  return result.records.map((i) => i.get("h").properties);
};

const login = async (username, password) => {
  const user = await findByUsername(username);
  if (user) {
    if (password == user.password) {
      return { message: "succes" };
    } else {
      return { message: "password incorrect" };
    }
  } else {
    return { message: "username incorrect" };
  }
};

const accepted = async (username, email, password) => {
  if (username === "") {
    return { message: "Username cannot be blank" };
  } else {
    if (await findByUsername(username)) {
      return { message: "Username already exist" };
    } else if (email === "") {
      return { message: "Email cannot be blank" };
    } else {
      if (await findByEmail(email)) {
        return { message: "Email already exist" };
      } else if (password === "") {
        return { message: "Password cannot be blank" };
      } else {
        return { message: "accepted" };
      }
    }
  }
};

const rateHotel = async (userId, hotelId, rating, comment) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (u:User {_id: "${userId}"}), (h:Hotel {_id: "${hotelId}"})
    MERGE (u)-[r:HAS_RATED {rating: ${rating}, comment: "${comment}"}]->(h)
    RETURN u, r, h`
  );
  session.close();
  return result.records[0]?.get("r").properties;
};

const getIdByUsername = async (username) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH  (u:User {username: "${username}"}) 
    RETURN u._id AS id`
  );
  return result.records[0]?.get("id");
};

export default {
  findAll,
  findById,
  findBYIdAndDelete,
  create,
  changePassword,
  findByIdAndUpdate,
  createRelationshipHasVisit,
  getHotelsVisited,
  login,
  accepted,
  rateHotel,
  getIdByUsername,
};
