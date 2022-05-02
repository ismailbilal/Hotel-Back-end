import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findAll = async () => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`MATCH (n:City) RETURN n`);
  return result.records.map((i) => i.get("n").properties);
  session.close();
};

const findById = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:City {_id: "${id}"}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const create = async (obj) => {
  const session = driver.session({ DATABASE });
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:City {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
      8
    )}" RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  const session = driver.session({ DATABASE });
  // n.name = "${obj.name}", n.address="${obj.address}"
  const result = await session.run(
    `MATCH (n:City {_id: "${id}"}) SET n.name= "${obj.name}" RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  const session = driver.session({ DATABASE });
  await session.run(`MATCH (n:City {_id: "${id}"}) DELETE n`);
  session.close();
  return await findAll();
};

const findLocality = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (l:Locality)-[:EXIST_IN]->(c:City {_id: "${id}"})
    RETURN l`
  );
  session.close();
  return result.records.map((i) => i.get("l").properties);
};

export default {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findBYIdAndDelete,
  findLocality,
};
