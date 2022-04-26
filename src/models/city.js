import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
const session = driver.session({ DATABASE });

const findAll = async () => {
  const result = await session.run(`MATCH (n:City) RETURN n`);
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const result = await session.run(
    `MATCH (n:City {_id: "${id}"}) RETURN n LIMIT 1`
  );
  return result.records[0].get("n").properties;
};

const create = async (obj) => {
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:City {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
      8
    )}" RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  // n.name = "${obj.name}", n.address="${obj.address}"
  const result = await session.run(
    `MATCH (n:City {_id: "${id}"}) SET n.name= "${obj.name}" RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  await session.run(`MATCH (n:City {_id: "${id}"}) DELETE n`);
  return await findAll();
};

const findLocality = async (id) => {
  const result = await session.run(
    `MATCH (l:Locality)-[:EXIST_IN]->(c:City {_id: "${id}"})
    RETURN l`
  );
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
