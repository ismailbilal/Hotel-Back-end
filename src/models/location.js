import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { url, db_username, db_password, database } = process.env;

const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password));
const session = driver.session({ database });

const findAll = async () => {
  const result = await session.run(`MATCH (n:Location) RETURN n`);
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const result = await session.run(
    `MATCH (n:Location {_id: "${id}"}) RETURN n LIMIT 1`
  );
  return result.records[0].get("n").properties;
};

const create = async (obj) => {
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:Location {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
      8
    )}", n.address= "${writeParm(obj.address)}", n.lon= ${
      obj.lon
    }, n.lat= ${writeParm(obj.lat)} RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  // n.name = "${obj.name}", n.address="${obj.address}"
  const result = await session.run(
    `MATCH (n:Location {_id: "${id}"}) SET n.name= "${
      obj.name
    }", n.address= "${writeParm(obj.address)}", n.lon= ${
      obj.lon
    }, n.lat= ${writeParm(obj.lat)} RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  await session.run(`MATCH (n:Location {_id: "${id}"}) DELETE n`);
  return await findAll();
};

const findHotel = async (id) => {
  const result = await session.run(
    `MATCH (h:Hotel)-[:LOCATED_IN]->(l:Location {_id: "${id}"}) RETURN h`
  );
  return result.records[0].get("h").properties;
};

const findLocality = async (id) => {
  const result = await session.run(`
    MATCH (l:Location {_id: "${id}"})-[:POSITIONED_IN]->(lo:Locality)
    RETURN lo
  `);
  return result.records.map((i) => i.get("lo").properties);
};

const createRelationshipToLocality = async (locationId, localityId) => {
  const result = await session.run(`
    MATCH (l:Location {_id: "${locationId}"}),
    (lo:Locality {_id: "${localityId}"})
    MERGE (l)-[r:POSITIONED_IN]->(lo)
    RETURN l, r, lo
  `);
  return result.records;
};

export default {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findBYIdAndDelete,
  findHotel,
  findLocality,
  createRelationshipToLocality,
};
