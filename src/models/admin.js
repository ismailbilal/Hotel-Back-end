import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
const session = driver.session({ DATABASE });

const findAll = async () => {
  const result = await session.run(`MATCH (n:Admin) RETURN n`);
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const result = await session.run(
    `MATCH (n:Admin {_id: "${id}"}) RETURN n LIMIT 1`
  );
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const findByEmail = async (email) => {
  const result = await session.run(
    `MATCH (n:Admin {email: '${email}'}) RETURN n LIMIT 1`
  );
  return result.records[0] ? result.records[0].get("n").properties : null;
};

const create = async (obj) => {
  const result = await session.run(
    `MERGE (n:Admin {email:"${obj.email}"}) 
        ON CREATE SET n._id= "${nanoid(8)}",
                    n.password = "${obj.password}"
        RETURN n`
  );
  return result.records[0].get("n").properties;
};

const changeEmail = async (id, obj) => {
  const result = await session.run(
    `MATCH (n:Admin {_id: "${id}"})
            n.email = "${obj.email}"
        RETURN n`
  );
  return result.records[0].get("n").properties;
};

const changePassword = async (id, obj) => {
  const result = await session.run(
    `MATCH (n:Admin {_id: "${id}"})
            SET n.password = "${obj.password}"
        RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  await session.run(`MATCH (n:Admin {_id: "${id}"}) DETACH DELETE n`);
  return await findAll();
};

const login = async (email, password) => {
  const user = await findByEmail(email);
  if (user) {
    if (password == user.password) {
      return { massage: "succes" };
    } else {
      return { message: "password incorrect" };
    }
  } else {
    return { massage: "email incorrect" };
  }
};

export default {
  findAll,
  findById,
  findBYIdAndDelete,
  create,
  changePassword,
  changeEmail,
  login,
};
