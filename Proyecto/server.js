const { MongoClient, ServerApiVersion } = require('mongodb');

// Reemplaza <db_password> con tu contraseña real
const uri = "mongodb+srv://prueba-log:123.123.123@cluster0.ya8zzhl.mongodb.net/?appName=Cluster0";

// Crear un MongoClient con la configuración de la versión de la API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Conectar al servidor MongoDB
    await client.connect();
    // Hacer un ping para confirmar la conexión exitosa
    await client.db("EduTrack360").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Asegura que el cliente se cierre al finalizar o si ocurre un error
    await client.close();
  }
}

// Ejecutar la función
run().catch(console.dir);
