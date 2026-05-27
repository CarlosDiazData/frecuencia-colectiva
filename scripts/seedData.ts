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
    body: `<p>El cine se convertirá este Día de las Madres en un espacio de encuentro familiar y celebración. La Cineteca Mexiquense anunció una programación especial con entrada gratuita para tres funciones dirigidas al público en general como parte de sus actividades culturales programadas para este 10 de mayo en el Estado de México.</p>

<p>Ubicada en Toluca, la Cineteca Mexiquense se ha consolidado como uno de los espacios culturales más importantes de la ciudad, albergando festivales, ciclos de cine y actividades relacionadas con la difusión audiovisual. A través de este tipo de eventos, el recinto mantiene una línea de trabajo enfocada en ampliar el acceso a la cultura y fortalecer la participación del público en actividades artísticas.</p>

<p>La jornada comenzará a las 12:30 horas con la proyección de <cite>¡Patos!</cite>, película animada enfocada en la aventura y convivencia familiar, más tarde a las 14:10 horas, se presentará <cite>Cosas que importan</cite>, cinta centrada en las relaciones humanas y los vínculos emocionales. Finalmente, el cierre de la programación será a las 16:35 horas con <cite>Mamma Mia: Vamos otra vez</cite>, musical reconocido por su temática familiar y ambiente festivo.</p>

<p>Con esta iniciativa, la Cineteca Mexiquense busca ofrecer una alternativa cultural para las familias durante una de las fechas más representativas del año, además de ofrecer una opción de entretenimiento, el recinto pretende acercar al público a distintas propuestas cinematográficas en un ambiente accesible y recreativo.</p>

<p>La celebración también representa una oportunidad para fortalecer la convivencia social a través del cine, una de las expresiones artísticas con mayor capacidad para reunir distintas generaciones. En ese sentido, la programación fue pensada para incluir contenidos dirigidos tanto al público infantil como a jóvenes y adultos, permitiendo que madres, hijos y familiares compartan una experiencia conjunta.</p>

<p>La entrada gratuita estará disponible únicamente este 10 de mayo y hasta completar el aforo de cada función. La invitación permanece abierta para quienes deseen celebrar desde un espacio cultural donde el cine será el principal protagonista de la jornada.</p>`,
    author: 'Rodrigo Segura',
    date: '2026-05-09T10:00:00Z',
    category: 'cine-y-audiovisual',
    imageUrl: 'https://i.imgur.com/45rj3a3.jpeg',
    readTimeMinutes: 5,
  },
  {
    articleId: 'av-002-2024-0002',
    title: 'Así se vivió el homenaje a las madres este 10 de mayo en el teatro Morelos, Toluca',
    summary: 'El gobierno municipal de Toluca, bajo la dirección del edil Ricardo Moreno Bastida, inauguró este domingo un extenso calendario de actividades culturales con motivo del día de las Madres.',
    body: `<p>Enfatizando la utilización de lugares significativos y la distribución de eventos hacia las diversas comunidades del municipio, el evento principal de esta celebración es la presentación sin costo alguno, titulada <cite>Amor Eterno</cite>, ejecutada por la Orquesta Filarmónica de Toluca (OFiT) en el Teatro Morelos. La orquesta, bajo la batuta del maestro Gerardo Urbán y Fernández, programó dos actuaciones (a las 11:00 y 13:00 horas), ofreciendo un repertorio inspirado en la obra del afamado cantautor Juan Gabriel,  teniendo como solistas invitados a Rocío de la Vega y Harold Guerra. El programa exhibió composiciones emblemáticas como <cite>Querida</cite>, <cite>Hasta que te conocí</cite> y <cite>Costumbres</cite>, adaptadas para su interpretación sinfónica.</p>

<p>Según el Comunicado 474/2026 emitido por la Dirección General de Educación, Cultura y Turismo, la planificación de este año trascendió el ámbito del centro urbano. Este fin de semana la cultura destacó con talleres creativos, eventos artísticos desplegados en bibliotecas Municipales y delegaciones como Santiago Tlacotepec y San Antonio Buenavista, con el objetivo principal de fortificar el entramado social y hacerla más accesible, eliminando el viaje largo. La era digital trajo consigo la <cite>Serenata a mamá</cite>, propuesta del municipio manejada por convocatorias en redes sociales del gobierno. La gente podia proponer madres para serenatas, uniendo lo virtual de la participación ciudadana con la calidez de eventos presenciales que tocaban las emociones.</p>

<p>Los museos locales, incluyendo Bellas Artes y la Estampa, ofrecieron arteterapia y exhibiciones como <cite>H2O para llevar</cite>, mientras que la seguridad estuvo garantizada. La Dirección General de Seguridad y Protección implementó un operativo entre recintos culturales y áreas de gran concurrencia.</p>

<p>Finalmente, el Ayuntamiento de Toluca reitera su invitación a la población a seguir consultando la cartelera cultural digital a través de los canales oficiales para los próximos eventos de la temporada de primavera.</p>`,
    author: 'Laura Neira Bernal',
    date: '2026-05-10T14:30:00Z',
    category: 'arte-visual',
    imageUrl: 'https://i.imgur.com/45rj3a3.jpeg',
    readTimeMinutes: 3,
  },
  {
    articleId: 'av-003-2024-0002',
    title: 'Festival MAREVA: Sabino hizo cantar a Lerma con un concierto gratuito.',
    summary: 'Un concierto lleno de energía y cercanía es el que ofreció el rapero mexicano Sabino la noche del lunes 20 de abril de 2026, en el escenario del Festival MAREVA en Lerma.',
    body: `<p>Un concierto lleno de energía y cercanía es el que ofreció el rapero mexicano Sabino la noche del lunes 20 de abril de 2026, en el escenario del Festival MAREVA en Lerma.</p>

<p>El Ayuntamiento de Lerma expone en su sitio web oficial que el municipio es el corazón cultural del Estado de México, con el Festival Cultural Martín Reolín Varejón (MAREVA) se consolida una oferta cultural con personalidad propia, que privilegia las más elevadas expresiones humanas, en arte, tradición y cultura.</p>

<p>En cuanto dieron las 7 de la noche apareció la primera sorpresa de la noche, las pantallas que estaban sobre el escenario proyectaron las letras de Marco Mares, quien comenzó el concierto. De inmediato, el público entró en emoción con el cantante, porque cuando termino su primer tema le aplaudieron y gritaron <q>Te amo Marco</q> en repetidas ocasiones.</p>

<p>Después de que Mares se despidiera de la audiencia, a las 20:00 horas entro a la escena el baterista para explicar las reglas del show con la finalidad de darle la bienvenida a Sabino.</p>

<blockquote>
<p>¿Ustedes son los grandes rebeldes del hop? ¿Sí o no? Entonces ustedes contestan cuando yo digo los rebeldes del Pop: HU HU. Y si yo digo 'Sab' tú me contestas: HOP HOP</p>
<cite>— Tío Torres, baterista</cite>
</blockquote>

<p>Acto seguido Sabino comenzó su concierto con el tema <cite>Sab Hop</cite>.</p>

<p>En un instante inesperado, Sabino se quitó la camisa a petición de sus fans y para demostrar que no está enfermo, como algunos comentarios en redes sociales lo han insinuado.</p>

<p>Con el tema <cite>Guapa!</cite> se presentaron problemas técnicos, se perdió el audio de su micrófono y la música. Lejos de incomodarse, el cantante siguió cantando en a capela con apoyo de su público, conformado en su mayoría por jóvenes, adultos jóvenes y padres acompañando a sus hijos. También aprovecho para tomarse fotos desde el escenario hasta que volvió el audio, le pregunto a su audiencia si retomaban la canción.</p>

<blockquote>
<p>No opines de los demás, enfócate en ti… Eres un motor que me hace seguir con vida</p>
<cite>— Sabino</cite>
</blockquote>

<p>refiriéndose a todos como <q>cariño</q>, lo que provocó una conexión especial con la audiencia. Así que de inmediato dio paso a <cite>9:15</cite>, <cite>Conmigo siempre</cite> y <cite>Tú</cite>.</p>

<p>Sabino dejó claro que la velada es especial, al declarar que había sido la mejor noche del año y prometer que regresaría con más frecuencia a estos rumbos, lo que generó entusiasmo inmediato entre los asistentes.</p>

<p>Después más de dos horas de concierto, donde hizo cantar y grabar a más de 1,000 mil personas, Sabino decidió terminar por todo lo alto el concierto, y lo hizo con su gran éxito <cite>Película</cite>, armando el ambiente para la foto final y su despedida.</p>`,
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
    body: `<p>La presidenta Claudia Sheinbaum Pardo presentó este lunes, durante la Mañanera del Pueblo, la convocatoria de la segunda edición de <cite>México Canta</cite>, un certamen con el que el gobierno federal busca impulsar el talento de jóvenes compositores e intérpretes de regional mexicano. En el anuncio participaron también la secretaria de Cultura, Claudia Curiel de Icaza, así como las cantantes Majo Aguilar y Junior H.</p>

<p>De acuerdo con la información difundida por AMEXI, la convocatoria está dirigida a jóvenes de entre 18 y 29 años, tanto de México como de la comunidad mexicoestadunidense, quienes podrán registrarse hasta el 10 de junio de 2026. El proyecto busca dar espacio a propuestas musicales con una narrativa de paz y alejada de la apología del delito.</p>

<p>La final del certamen está prevista para el 13 de septiembre en el Auditorio Nacional, mientras que las semifinales se realizarán en Los Ángeles, Estados Unidos, y Mazatlán, Sinaloa. Además, las personas ganadoras tendrán la oportunidad de abrir el concierto del 15 de septiembre en el Zócalo capitalino.</p>`,
    author: 'Francisco Mireles',
    date: '2026-05-11T14:30:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://www.jornada.com.mx/ndjsimg/images/jornada/jornadaimg/junto-a-majo-aguilar-y-junior-h-sheinbaum-lanza-la-segunda-edicion-de-mexico-canta/junto-a-majo-aguilar-y-junior-h-sheinbaum-lanza-la-segunda-edicion-de-mexico-canta_cf7a6aee-9af7-49f5-9d07-c33bc93e86cc_medialjnimgndimage=fullsize',
    readTimeMinutes: 5,
  },
  {
    articleId: 'av-005-2024-0002',
    title: 'La UAEMéx abre el telón a su tercera temporada de teatro en Toluca',
    summary: 'La cartelera integra seis propuestas teatrales dirigidas a públicos infantiles, juveniles y adultos. Las funciones estarán disponibles en los teatros universitarios "Los Jaguares" y "Esvón Gamaliel".',
    body: `<p>La compañía Universitaria de Teatro de la UAEMex, a través de sus redes sociales, dio a conocer su tercera temporada del 2026. Esta temporada consta de seis puestas en escena que abarcan géneros como la comedia, la sátira política, drama e historias infantiles, ofreciendo al público una diversidad de temas de interés.</p>

<p>La compañía teatral pone a disposición de las y los toluqueños una nueva forma de entretenimiento con obras dirigidas a públicos de todas las edades, acercando así el arte y las actividades culturales a la sociedad. Estas producciones teatrales estarán disponibles en el Teatro Universitario Los Jaguares y el Teatro de Cámara Esvón Gamaliel desde el 7 de mayo hasta el 28 de junio del 2026.</p>

<p>Entre las obras presentadas se encuentran <cite>Astros, arrullos para Lulú</cite>, dirigida a adolescentes y adultos; <cite>Trump The King</cite>, para adolescentes y adultos; <cite>La hoguera</cite>, para mayores de edad; <cite>El Médico a Palos</cite> y <cite>El Mechacorta</cite>, dirigidas a adolescentes y adultos; y <cite>Un Reino de Brujos y niños</cite>, para un público familiar e infantil.</p>

<strong>Costos, horarios y ubicaciones</strong>

<strong>Teatro Universitario "Los Jaguares"</strong>

<strong>El médico a palos</strong>
<ul>
<li><strong>Fechas:</strong> Del 7 de mayo al 28 de junio</li>
<li><strong>Horarios:</strong> jueves a sábado: 17:00 horas y domingos: 16:00 horas</li>
</ul>

<strong>El mechacorta</strong>
<ul>
<li><strong>Fechas:</strong> Del 7 de mayo al 28 de junio</li>
<li><strong>Horarios:</strong> jueves a sábado: 19:00 horas y domingos: 18:00 horas</li>
</ul>

<strong>Un reino de brujos y niños</strong>
<ul>
<li><strong>Fechas:</strong> Del 9 de mayo al 28 de junio</li>
<li><strong>Horarios:</strong> sábados y domingos: 13:00 horas</li>
</ul>

<strong>La hoguera</strong>
<ul>
<li><strong>Fechas:</strong> Del 11 de mayo al 23 de junio</li>
<li><strong>Horarios:</strong> lunes y martes: 19:00 horas</li>
</ul>

<strong>Teatro Universitario De Cámara "Esvón Gamaliel"</strong>

<strong>Astros, arrullos para Lulú</strong>
<ul>
<li><strong>Fechas:</strong> Del 7 de mayo al 27 de junio</li>
<li><strong>Horarios:</strong> jueves a sábados: 17:00 horas</li>
</ul>

<strong>Trump The King</strong>
<ul>
<li><strong>Fechas:</strong> Del 7 de mayo al 27 de junio</li>
<li><strong>Horarios:</strong> jueves a sábados: 19:00 horas</li>
</ul>

<p>Los costos de recuperación van desde los $55 hasta los $120, dependiendo de la función y el tipo de acceso, por lo que la compañía invita al público a disfrutar de esta experiencia cultural y teatral en la ciudad de Toluca.</p>`,
    author: 'Rosario Romero Pérez',
    date: '2026-05-07T10:00:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://i.imgur.com/XA9GGh4.jpeg',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-006-2026-0003',
    title: 'La experimentación sonora tomó el Museo Leopoldo Flores con "Arquitectura de Pulso"',
    summary: 'EmilHerdez y Xanat García presentaron un set de música electrónica experimental acompañado de visuales en vivo ante más de 30 asistentes dentro del Museo Universitario Leopoldo Flores.',
    body: `<p>Los sonidos atmosféricos y las visuales envolvieron el espacio del Museo Universitario Leopoldo Flores durante la presentación del proyecto performático Arquitectura de Pulso, realizado el jueves 14 de mayo de 2026. El evento reunió a más de 30 personas que asistieron para presenciar una propuesta enfocada en la música electrónica experimental y la exploración audiovisual en vivo.</p>

<p>El artista EmilHerdez, acompañado de Xanat García, presentó un set experimental construido a partir de sonidos ambientales, atmósferas electrónicas y secuencias inmersivas que transformaron el recinto en una experiencia sensorial. La presentación estuvo acompañada de visuales proyectadas en tiempo real, generando una conexión entre sonido, imagen y espacio.</p>

<p>La propuesta destacó por su carácter experimental, alejándose de las estructuras tradicionales de la música electrónica para centrarse en paisajes sonoros lentos y envolventes. A lo largo de la presentación, los asistentes permanecieron atentos a las variaciones de sonido y a la interacción visual que acompañaba cada transición musical.</p>

<p>El proyecto <cite>Arquitectura de Pulso</cite> forma parte de una serie de actividades artísticas que buscan integrar distintas disciplinas dentro de espacios culturales universitarios. En este caso, la combinación de música electrónica y arte visual permitió crear una experiencia enfocada en la contemplación y la percepción sensorial del público.</p>

<p>Con eventos de este tipo, el Museo Universitario Leopoldo Flores continúa funcionando como un espacio abierto a propuestas contemporáneas y experimentales, dando lugar a artistas emergentes y proyectos que exploran nuevas formas de expresión artística dentro de la escena cultural mexiquense.</p>`,
    author: 'Rodrigo Segura',
    date: '2026-05-14T10:00:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://i.pinimg.com/736x/37/ba/9a/37ba9aa45e6516ddb65218072e013262.jpg',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-007-2026-0003',
    title: 'El documental "La nube en el jardín" de Ed Maverick llega a salas de Metepec',
    summary: 'El proyecto cinematográfico basado en el álbum "La nube en el jardín" del cantautor mexicano Ed Maverick comenzó su exhibición en salas de cine del país, incluyendo funciones en Metepec. El documental muestra una presentación en vivo grabada desde la Sala Nezahualcóyotl y expande la propuesta visual y emocional del artista chihuahuense.',
    body: `<p>El documental <cite>La nube en el jardín</cite>, inspirado en el álbum homónimo de Ed Maverick, llegó este mes a distintas salas de cine de México, incluyendo funciones en Metepec dentro del complejo Cinemex ubicado en Town Square Metepec. La producción presenta una experiencia cinematográfica construida a partir del concierto grabado en vivo desde la Sala Nezahualcóyotl, uno de los recintos culturales más importantes del país.</p>

<p>A través de una propuesta visual íntima y contemplativa, el proyecto muestra la interpretación completa del álbum lanzado por el cantante originario de Chihuahua. Desde su anuncio en redes sociales, el documental generó expectativa entre seguidores del cantautor, especialmente por tratarse de una de las etapas musicales más personales de Ed Maverick. <cite>La nube en el jardín</cite> se caracteriza por sonidos acústicos, arreglos orquestales y letras enfocadas en la nostalgia, la soledad y la introspección.</p>

<p>La exhibición forma parte de una serie de funciones especiales distribuidas en distintas ciudades del país a partir del 13 de mayo. En Metepec, las funciones pueden consultarse directamente en la cartelera digital de Cinemex.</p>`,
    author: 'Francisco Mireles',
    date: '2026-05-13T10:00:00Z',
    category: 'cine-y-audiovisual',
    imageUrl: 'https://www.melodiaviajera.com/wp-content/uploads/2026/04/unnamed-14-1.jpg',
    readTimeMinutes: 3,
  },
  {
    articleId: 'av-008-2026-0003',
    title: 'Iluminan de morado edificios históricos por el Día Mundial del Lupus',
    summary: 'El Día Mundial del Lupus se conmemoró este 10 de mayo con un gesto simbólico que iluminó de color morado congresos estatales y edificios históricos en distintas entidades de la República Mexicana, entre ellas Puebla, Guanajuato, Tamaulipas, Coahuila, Chihuahua y Baja California.',
    body: `<p>El Día Mundial del Lupus se conmemoró este 10 de mayo con un gesto simbólico que iluminó de color morado congresos estatales y edificios históricos en distintas entidades de la República Mexicana, entre ellas Puebla, Guanajuato, Tamaulipas, Coahuila, Chihuahua y Baja California.</p>

<p>La iniciativa busca visibilizar y concientizar sobre la importancia de las enfermedades autoinmunes, de acuerdo con el medio <cite>El Tiempo MX</cite> señala que en México existen más de 5 millones de personas con enfermedades autoinmunes y crónicas.</p>

<p>En particular, las personas que padecen lupus en México se estima que son 20 de cada 100,000 con una mayor prevalencia en mujeres, según el Registro Mexicano de Lupus por la Universidad Nacional Autónoma de México (UNAM). Por ende, la iluminación morada en congresos es por la iniciativa de la llamada Ley Lupus y Autoinmunes, que pretende garantizar derechos y atención médica adecuada a quienes viven con estos padecimientos.</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/AlXT97l5xME" title="Día Mundial del Lupus" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<p>En el encendido participaron asociaciones civiles junto con diputados locales que respaldan la legislación en sus estados, reforzando el compromiso de lucha por los derechos de las personas afectadas.</p>

<p>Tal es el caso del Centro de Estudios Transdisciplinarios Athié-Calleja por los Derechos de las Personas con Lupus A.C. (Cetlu), una organización que lidera <cite>La Ola Morada</cite> como un proyecto de Laura Athié y Efrén Calleja Macedo con el fin de formar un cuerpo social que comparte esperanzas y voluntades para romper el aislamiento, la competencia y el silenciamiento a los cuerpos enfermos. Por medio de los canales oficiales, el Congreso del Estado Libre y Soberano de Tamaulipas declaró:</p>

<blockquote>
<p>A través de este acto simbólico, el Poder Legislativo refrenda su compromiso de promover la empatía, la visibilización y el respaldo a quienes enfrentan diariamente esta condición, reconociendo también la fortaleza y resiliencia de las familias que les acompañan.</p>
<cite>— Congreso del Estado Libre y Soberano de Tamaulipas</cite>
</blockquote>

<p>El color morado, símbolo de esta causa, se convirtió en un recordatorio de unidad y de la necesidad de impulsar políticas públicas que atiendan de manera integral a quienes enfrentan el lupus y otras enfermedades autoinmunes.</p>`,
    author: 'Marisol Ramirez',
    date: '2026-05-11T10:00:00Z',
    category: 'patrimonio',
    imageUrl: 'https://scontent.fpbc6-1.fna.fbcdn.net/v/t39.30808-6/696286743_908476958914350_1474143920230196813_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=bVEkfziE_-8Q7kNvwFfTV9B&_nc_oc=AdpKCgJdRDjN85T3OU__RMVvD7Su0zlBXdzqu37PiBI6tRq6yCFDD-uiZb9ku6twW-TrKdQizhpzJZTcSdkFjreh&_nc_zt=23&_nc_ht=scontent.fpbc6-1.fna&_nc_gid=WSlIv_OKYjGXJZgYIDoAPA&_nc_ss=7b289&oh=00_Af48aV4MZs0JflvD52RczCS5CUAqQJdgVdj2XYlO-oD67g&oe=6A1C04D6',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-009-2026-0003',
    title: 'El Gusto de la Resistencia: la Ciencia y la Memoria del Pulque en Toluca',
    summary: 'Desde una mirada colombiana, Laura Neira explora la tradición del pulque en Toluca y Metepec: un legado biocultural que une ciencia, resistencia y memoria colectiva frente al olvido.',
    body: `<p>Afrontar el Valle de Toluca viniendo desde Colombia, forzosamente supone una confrontación con la elevación del terreno y el rigor helado del sol. A aquellos de nosotros criados en el perfume del café, la capital mexiquense puede exhibirse en una evaluación preliminar, como un núcleo de hormigón desenvuelto con premura. Con todo, al concederse uno la licencia de menoscabar lo aparente y explorar sus márgenes, se desvela que este territorio alberga vestigios de una opulencia biológica y humana sumamente conmovedora. La más significativa travesía cultural durante esta travesía no se manifestó dentro de un recinto museístico, sino al pie de las austeras entradas de un tinacal, desentrañando la esencia del pulque.</p>

<p>Desde mi posición como colombiana, la manifestación del pulque provocó en mí un reconocimiento instantáneo y de forma simultánea, un profundo asombro. En mi patria, la chicha, esa bebida de maíz fermentado de raigambre, vivió una suerte calcada a la del néctar del maguey. Una ofensiva coordinada de descrédito irrumpió a principios del siglo pasado, orquestada por los emporios cerveceros. Estos la difamaron, tachándola de <q>insalubre</q> y <q>prohibida</q>, con el fin de forzar la adopción de sus productos industriales. En consecuencia, observar el pulque, con su defensa apasionada y su disfrute pleno en Toluca y Metepec, no solo representa para mí un deleite de sabor; es ser testigo de un triunfo de la resistencia cultural, porque el pulque se erige más allá de ser un simple refresco popular; es más bien un entramado de tradición, en el cual la herencia colectiva se entrelaza con algunos procesos microbiológicos.</p>

<p>Para calibrar la solidez de este legado, tuve el honor de dialogar con sus custodios. Don Ernesto Morales, un cultivador con más de cuarenta años inmerso en el cuidado del maguey (<em>Agave salmiana</em>) en las áreas rurales aledañas a Metepec, me comentó que aquí, la espera se contabiliza en lustros y el proceso se capta con percepción innata.</p>

<blockquote>
<p>Gran parte de la población en las urbanizaciones recientes de Metepec o el núcleo de Toluca tiende a creer que el pulque es un producto espontáneo del campo o que es originado por casualidad, pero la verdad es que es una labor artesanal que demanda de mucho cuidado.</p>
<cite>— Ernesto Morales, maestro tlachiquero</cite>
</blockquote>

<p>Me explicó también que para que un maguey alcance su punto de maduración en esta región de clima templado, un lapso de ocho a doce años es indispensable, permitiendo su descalibre inicial y después raspado. Si se omite la interpretación de las señales que comunica la planta, el maguey se pudrirá, dañando así una década de esfuerzo en cuestión de horas.</p>

<blockquote>
<p>Después de recoger el aguamiel, empieza lo que considero el reto en el tinacal. La temperatura de Toluca influye mucho sobre los microorganismos, de bacterias y levaduras, que son la esencia de la tarea de fermentación como tal del pulque. Siempre evitamos que haya sustancias químicas y esas cosas artificiales; todo lo que es la temperatura y preservación de la cultura iniciadora, a saber, el pulque materno, es empírico, pero pienso que también es de una exactitud heredada.</p>
<cite>— Ernesto Morales, maestro tlachiquero de la zona</cite>
</blockquote>

<p>La declaración de Don Ernesto derriba cualquier noción preconcebida y colonial sobre el conocimiento autóctono y rural. Los productores de pulque no actúan por mero azar, sino que implementan una tradición ancestral ajustada a sus necesidades. Ejemplares proyectos de la región, como el Tinacal "El Capulín", dan a conocer cómo el paso a materiales inofensivos y protocolos de higiene rigurosos ha salvaguardado el ecosistema de bacterias lácticas y levaduras, asegurando la integridad del producto sin interferir en su distintivo sabor; y esta no es una visión meramente personal de una relatora cautivada, pues el rigor científico fundamenta cada sorbo:</p>

<p>Investigaciones del Instituto Politécnico Nacional (IPN), en especial el CICATA, lograron aislar las bacterias lácticas del pulque, exhibiendo potentes cualidades probióticas. Se evidenció su facultad para frenar microorganismos dañinos y un elevado volumen de aminoácidos, así como vitaminas esenciales.</p>

<p>Por otro lado, desde una óptica ecológica, la Facultad de Ciencias Agrícolas de la UAEMéx ha consignado que la siembra del <em>Agave salmiana</em> opera como un escudo biológico crucial en Toluca y Metepec. Su sistema radicular extenso detiene la desestabilización hídrica del suelo y su metabolismo se ha adaptado de manera óptima para fijar carbono y propiciar la infiltración de agua al manto acuífero de la zona, que sufre de sobreexplotación.</p>

<p>Vivir la idiosincrasia del pulque en Toluca, comprender la multiplicidad de sus curados —en los que se fusionan insumos como la avena o la piña con el proceso de fermentación— y observar a universitarios jóvenes uniéndose en tertulia para tomarlo, puede ser una de las vivencias más interesantes de mi estancia en México. La praxis del periodismo cultural debidamente ejercida conlleva una obligación, la de enaltecer estos espacios. Que el pulque ya no sea abordado meramente como un objeto de interés exótico para el visitante o un pasatiempo de tinte nostálgico para alguno que otro ocaso semanal. Lo veo más bien, un legado biocultural dinámico, y una enseñanza valiosa para aquel que lo conozca. En ocasiones, se hace imprescindible una perspectiva ajena para rememorar aquello que la rutina tiende a difuminar y que en las raíces profundas del agave originario de esta región mexiquense late una disciplina tan rigurosa y merecedora de respeto como la que se investiga en cualquier recinto científico a nivel planetario.</p>`,
    author: 'Laura Neira',
    date: '2026-05-23T10:00:00Z',
    category: 'patrimonio',
    imageUrl: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2024/12/pulque-ok-900x506.png',
    readTimeMinutes: 4,
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