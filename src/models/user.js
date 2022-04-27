import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
const session = driver.session({ DATABASE });

const findByUsername = async (username) => {
  const result = await session.run(
    `MATCH (n:User {username: '${username}'}) RETURN n LIMIT 1`
  );
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const findByEmail = async (email) => {
  const result = await session.run(
    `MATCH (n:User {email: '${email}'}) RETURN n LIMIT 1`
  );
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const findAll = async () => {
  const result = await session.run(`MATCH (n:User) RETURN n`);
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const result = await session.run(
    `MATCH (n:User {_id: "${id}"}) RETURN n LIMIT 1`
  );
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const create = async (obj) => {
  if (await findByUsername(obj.username)) {
    return { message: "username exist" };
  }
  if (await findByEmail(obj.email)) {
    return { message: "email exist" };
  }
  const result = await session.run(
    `MERGE (n:User {username:"${obj.username}"}) 
        ON CREATE SET n._id= "${nanoid(8)}",
                    n.email = "${obj.email}",
                    n.password = "${obj.password}"
        RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  const result = await session.run(
    `MATCH (n:User {_id: "${id}"})
        SET n.firstname = "${obj.firstname}",
            n.lastname = "${obj.lastname}",
            n.email = "${obj.email}"
        RETURN n`
  );
  return result.records[0].get("n").properties;
};

const changePassword = async (id, password) => {
  const result = await session.run(
    `MATCH (n:User {_id: "${id}"})
            SET n.password = "${password}"
        RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  await session.run(`MATCH (n:User {_id: "${id}"}) DETACH DELETE n`);
  return await findAll();
};

const createRelationshipHasVisit = async (userId, hotelId) => {
  const result = await session.run(
    `MATCH (u:User {_id: "${userId}"}), (h:Hotel {_id: "${hotelId}"})
    MERGE (u)-[v:HAS_VISITE]->(h)
    RETURN u, v, h`
  );
  return result.records[0];
};

const getHotelsVisited = async (id) => {
  const result = await session.run(
    `MATCH (u:User {_id: "${id}"})-[:HAS_VISITE]->(h:Hotel)
    RETURN h`
  );
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
};
