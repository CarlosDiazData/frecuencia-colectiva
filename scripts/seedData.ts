import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

interface Article {
  articleId: string;
  title: string;
  summary: string;
  body: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTimeMinutes: number;
}

const sampleArticles: Article[] = [
  // ARTE VISUAL (3)
  {
    articleId: 'av-001-2024-0001',
    title: 'La Cineteca Mexiquense celebrará el Día de las Madres con funciones gratuitas',
    summary: 'El recinto cultural ofrecerá este 10 de mayo tres proyecciones abiertas al público para fomentar la convivencia familiar a través del cine.',
    body: `El cine se convertirá este Día de las Madres en un espacio de encuentro familiar y celebración. La Cineteca Mexiquense anunció una programación especial con entrada gratuita para tres funciones dirigidas al público en general como parte de sus actividades culturales programadas para este 10 de mayo en el Estado de México.

Ubicada en Toluca, la Cineteca Mexiquense se ha consolidado como uno de los espacios culturales más importantes de la ciudad, albergando festivales, ciclos de cine y actividades relacionadas con la difusión audiovisual. A través de este tipo de eventos, el recinto mantiene una línea de trabajo enfocada en ampliar el acceso a la cultura y fortalecer la participación del público en actividades artísticas.

La jornada comenzará a las 12:30 horas con la proyección de ¡Patos!, película animada enfocada en la aventura y convivencia familiar, más tarde a las 14:10 horas, se presentará Cosas que importan, cinta centrada en las relaciones humanas y los vínculos emocionales. Finalmente, el cierre de la programación será a las 16:35 horas con Mamma Mia: Vamos otra vez, musical reconocido por su temática familiar y ambiente festivo.

Con esta iniciativa, la Cineteca Mexiquense busca ofrecer una alternativa cultural para las familias durante una de las fechas más representativas del año, además de ofrecer una opción de entretenimiento, el recinto pretende acercar al público a distintas propuestas cinematográficas en un ambiente accesible y recreativo.

La celebración también representa una oportunidad para fortalecer la convivencia social a través del cine, una de las expresiones artísticas con mayor capacidad para reunir distintas generaciones. En ese sentido, la programación fue pensada para incluir contenidos dirigidos tanto al público infantil como a jóvenes y adultos, permitiendo que madres, hijos y familiares compartan una experiencia conjunta.

La entrada gratuita estará disponible únicamente este 10 de mayo y hasta completar el aforo de cada función. La invitación permanece abierta para quienes deseen celebrar desde un espacio cultural donde el cine será el principal protagonista de la jornada.`,
    author: 'Rodrigo Segura',
    date: '2026-05-09T10:00:00Z',
    category: 'cine-y-audiovisual',
    imageUrl: 'https://scontent.fpbc6-1.fna.fbcdn.net/v/t39.30808-6/697098980_1391093186398448_6308216465685133046_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=hs0H4SCqKo0Q7kNvwE4mMmC&_nc_oc=AdoZDE17FyBN5twd7dPvQKOQdVgB0tTzUqxGFAD146Qy_J11lk5N6qMsngKqsRB5J5uLKrJMMlZFMR9RoXwL7UtA&_nc_zt=23&_nc_ht=scontent.fpbc6-1.fna&_nc_gid=nvMQIVrowfTSzv1v6WWudg&_nc_ss=7b289&oh=00_Af5-cXePnGn1NBoeJdtfJDwf0wKJ0NnB6PzheQtcm2NRVw&oe=6A07C5F3',
    readTimeMinutes: 5,
  },
  {
    articleId: 'av-002-2024-0002',
    title: 'Así se vivió el homenaje a las madres este 10 de mayo en el teatro Morelos, Toluca',
    summary: 'El gobierno municipal de Toluca, bajo la dirección del edil Ricardo Moreno Bastida, inauguró este domingo un extenso calendario de actividades culturales con motivo del día de las Madres.',
    body: `Enfatizando la utilización de lugares significativos y la distribución de eventos hacia las diversas comunidades del municipio, el evento principal de esta celebración es la presentación sin costo alguno, titulada "Amor Eterno", ejecutada por la Orquesta Filarmónica de Toluca (OFiT) en el Teatro Morelos. La orquesta, bajo la batuta del maestro Gerardo Urbán y Fernández, programó dos actuaciones (a las 11:00 y 13:00 horas), ofreciendo un repertorio inspirado en la obra del afamado cantautor Juan Gabriel,  teniendo como solistas invitados a Rocío de la Vega y Harold Guerra. El programa exhibió composiciones emblemáticas como “Querida”, “Hasta que te conocí” y “Costumbres”, adaptadas para su interpretación sinfónica.

Según el Comunicado 474/2026 emitido por la Dirección General de Educación, Cultura y Turismo, la planificación de este año trascendió el ámbito del centro urbano. Este fin de semana la cultura destacó con talleres creativos, eventos artísticos desplegados en bibliotecas Municipales y delegaciones como Santiago Tlacotepec y San Antonio Buenavista, con el objetivo principal de fortificar el entramado social y hacerla más accesible, eliminando el viaje largo. La era digital trajo consigo la "Serenata a mamá", propuesta del municipio manejada por convocatorias en redes sociales del gobierno. La gente podia proponer madres para serenatas, uniendo lo virtual de la participación ciudadana con la calidez de eventos presenciales que tocaban las emociones.

Los museos locales, incluyendo Bellas Artes y la Estampa, ofrecieron arteterapia y exhibiciones como "H2O para llevar", mientras que la seguridad estuvo garantizada. La Dirección General de Seguridad y Protección implementó un operativo entre recintos culturales y áreas de gran concurrencia.

Finalmente, el Ayuntamiento de Toluca reitera su invitación a la población a seguir consultando la cartelera cultural digital a través de los canales oficiales para los próximos eventos de la temporada de primavera. 
`,
    author: 'Laura Neira Bernal',
    date: '2026-05-10T14:30:00Z',
    category: 'arte-visual',
    imageUrl: 'https://instagram.fpbc6-1.fna.fbcdn.net/v/t51.82787-15/671261642_18587587561039548_317813685417641817_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzg5NDI1MDgyMjc3OTc1MzE2Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuNjk0LnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=JCaukk4u88MQ7kNvwHhC_dD&_nc_oc=AdrcfaHZhnOB-Yw46fQIWssrYVWjaC3iXvyFQdOc7EI44uWgZ4KcfLJYu9MS1UEDbK_FEBhuFy5NsFj-TkUiSHpM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpbc6-1.fna&_nc_gid=crZo7jcY6-AqRp7yAoa6dg&_nc_ss=7a22e&oh=00_Af4Ke9yqjdt1Q9Z4p_9Wm05ssSD_f1ChjfEaIKg6hd1kwQ&oe=6A07D531',
    readTimeMinutes: 3,
  }
];

async function seedDatabase(): Promise<void> {
  console.log('Starting database seeding...');
  console.log(`Table name: ${TABLE_NAME}`);
  console.log(`Number of articles to seed: ${sampleArticles.length}`);

  const BATCH_SIZE = 25;
  const articlesToWrite = sampleArticles.map(article => ({
    PutRequest: {
      Item: article,
    },
  }));

  for (let i = 0; i < articlesToWrite.length; i += BATCH_SIZE) {
    const batch = articlesToWrite.slice(i, i + BATCH_SIZE);

    try {
      const command = new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: batch,
        },
      });

      await docClient.send(command);
      console.log(`Successfully seeded batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)`);
    } catch (error) {
      console.error(`Error seeding batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      throw error;
    }
  }

  console.log('Database seeding completed successfully!');
  console.log(`Seeded ${sampleArticles.length} articles across categories: arte-visual, arte-escenico, cine-y-audiovisual, festividades-locales, historias-familiares, gastronomia, patrimonio, identidad, agenda-cultural`);
}

seedDatabase().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});