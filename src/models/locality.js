import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findAll = async () => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`MATCH (n:Locality) RETURN n`);
  session.close();
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:Locality {_id: "${id}"}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const create = async (obj) => {
  const session = driver.session({ DATABASE });
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:Locality {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
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
    `MATCH (n:Locality {_id: "${id}"}) SET n.name= "${obj.name}" RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  const session = driver.session({ DATABASE });
  await session.run(`MATCH (n:Locality {_id: "${id}"}) DELETE n`);
  session.close();
  return await findAll();
};

const findHotels = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (l:Locality {_id: 'S7taec_G'})<-[r:POSITIONED_IN]-(p:Location)<-[r2:LOCATED_IN]-(h:Hotel)
    RETURN h`
  );
  session.close();
  return result.records.map((i) => i.get("h").properties);
};

const createRelationshipToCity = async (localityId, cityId) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (l:Locality {_id: "${localityId}"}),
    (c:City {_id: "${cityId}"})
    MERGE (l)-[r:EXIST_IN]->(c)
    RETURN l, r, c`
  );
  session.close();
  return result.records;
};

const findCity = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (l:Locality {_id: "${id}"})-[:EXIST_IN]->(c:City) RETURN c`
  );
  session.close();
  return result.records[0].get("c").properties;
};

export default {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findBYIdAndDelete,
  findHotels,
  createRelationshipToCity,
  findCity,
};
