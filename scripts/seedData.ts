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
  },
  {
    articleId: 'av-003-2024-0002',
    title: 'Festival MAREVA: Sabino hizo cantar a Lerma con un concierto gratuito.',
    summary: 'Un concierto lleno de energía y cercanía es el que ofreció el rapero mexicano Sabino la noche del lunes 20 de abril de 2026, en el escenario del Festival MAREVA en Lerma.',
    body: `Un concierto lleno de energía y cercanía es el que ofreció el rapero mexicano Sabino la noche del lunes 20 de abril de 2026, en el escenario del Festival MAREVA en Lerma.  

El Ayuntamiento de Lerma expone en su sitio web oficial que el municipio es el corazón cultural del Estado de México, con el Festival Cultural Martín Reolín Varejón (MAREVA) se consolida una oferta cultural con personalidad propia, que privilegia las más elevadas expresiones humanas, en arte, tradición y cultura.  

En cuanto dieron las 7 de la noche apareció la primera sorpresa de la noche, las pantallas que estaban sobre el escenario proyectaron las letras de Marco Mares, quien comenzó el concierto. De inmediato, el público entró en emoción con el cantante, porque cuando termino su primer tema le aplaudieron y gritaron “Te amo Marco” en repetidas ocasiones.  

Después de que Mares se despidiera de la audiencia, a las 20:00 horas entro a la escena el baterista para explicar las reglas del show con la finalidad de darle la bienvenida a Sabino 

“¿Ustedes son los grandes rebeldes del hop? ¿Sí o no? Entonces ustedes contestan cuando yo digo los rebeldes del Pop: HU HU. Y si yo digo ‘Sab’ tú me contestas: HOP HOP”, expreso Tio Torres con firmeza. Acto seguido Sabino comenzó su concierto con el tema "Sab Hop". 

En un instante inesperado, Sabino se quitó la camisa a petición de sus fans y para demostrar que no está enfermo, como algunos comentarios en redes sociales lo han insinuado.  

Con el tema “Guapa!” se presentaron problemas técnicos, se perdió el audio de su micrófono y la música. Lejos de incomodarse, el cantante siguió cantando en a capela con apoyo de su público, conformado en su mayoría por jóvenes, adultos jóvenes y padres acompañando a sus hijos. También aprovecho para tomarse fotos desde el escenario hasta que volvió el audio, le pregunto a su audiencia si retomaban la canción. 

“No opines de los demás, enfócate en ti… Eres un motor que me hace seguir con vida” expresó Sabino, refiriéndose a todos como “cariño”, lo que provocó una conexión especial con la audiencia. Así que de inmediato dio paso a "9:15", "Conmigo siempre" y "Tú". 

Sabino dejó claro que la velada es especial, al declarar que había sido la mejor noche del año y prometer que regresaría con más frecuencia a estos rumbos, lo que generó entusiasmo inmediato entre los asistentes. 

Después más de dos horas de concierto, donde hizo cantar y grabar a más de 1,000 mil personas, Sabino decidió terminar por todo lo alto el concierto, y lo hizo con su gran éxito “Película”, armando el ambiente para la foto final y su despedida.  
`,
    author: 'Marisol Ramirez',
    date: '2026-04-20T14:30:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://scontent.fpbc6-1.fna.fbcdn.net/v/t51.82787-15/670973414_18588540952055513_5577718994429706924_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pWg_SwG_d3EQ7kNvwHpnYeS&_nc_oc=AdqP1bsmDe7XUKAM9phuMHyt8W-L5yY2pjY3yNLoxN2HR84Wf6nTN71rn41hmDnRhOb812gHk4EbnPTRTVzEe4iw&_nc_zt=23&_nc_ht=scontent.fpbc6-1.fna&_nc_gid=I_RsvyGoqpbCf9poiogmAQ&_nc_ss=7b289&oh=00_Af7KzJU7-BvXOQkCNgO0fMhE6aY7_2EwW_8MAzz5yrOeYA&oe=6A0926FE',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-004-2024-0002',
    title: 'Sheinbaum lanza convocatoria de “México Canta” para impulsar talento juvenil del regional mexicano.',
    summary: 'La presidenta Claudia Sheinbaum presentó la segunda edición de “México Canta”, un certamen dirigido a jóvenes compositores e intérpretes de regional mexicano de México y de la comunidad mexicoestadunidense. La convocatoria estará abierta del 11 de mayo al 10 de junio y busca promover narrativas de paz en la música.',
    body: `La presidenta Claudia Sheinbaum Pardo presentó este lunes, durante la Mañanera del Pueblo, la convocatoria de la segunda edición de “México Canta”, un certamen con el que el gobierno federal busca impulsar el talento de jóvenes compositores e intérpretes de regional mexicano. En el anuncio participaron también la secretaria de Cultura, Claudia Curiel de Icaza, así como las cantantes Majo Aguilar y Junior H.  

De acuerdo con la información difundida por AMEXI, la convocatoria está dirigida a jóvenes de entre 18 y 29 años, tanto de México como de la comunidad mexicoestadunidense, quienes podrán registrarse hasta el 10 de junio de 2026. El proyecto busca dar espacio a propuestas musicales con una narrativa de paz y alejada de la apología del delito.  

La final del certamen está prevista para el 13 de septiembre en el Auditorio Nacional, mientras que las semifinales se realizarán en Los Ángeles, Estados Unidos, y Mazatlán, Sinaloa. Además, las personas ganadoras tendrán la oportunidad de abrir el concierto del 15 de septiembre en el Zócalo capitalino.  
`,
    author: 'Francisco Mireles',
    date: '2026-05-11T14:30:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://www.jornada.com.mx/ndjsimg/images/jornada/jornadaimg/junto-a-majo-aguilar-y-junior-h-sheinbaum-lanza-la-segunda-edicion-de-mexico-canta/junto-a-majo-aguilar-y-junior-h-sheinbaum-lanza-la-segunda-edicion-de-mexico-canta_cf7a6aee-9af7-49f5-9d07-c33bc93e86cc_medialjnimgndimage=fullsize',
    readTimeMinutes: 5,
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