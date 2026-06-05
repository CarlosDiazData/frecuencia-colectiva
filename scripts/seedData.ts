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

<p>Refiriéndose a todos como <q>cariño</q>, lo que provocó una conexión especial con la audiencia. Así que de inmediato dio paso a <cite>9:15</cite>, <cite>Conmigo siempre</cite> y <cite>Tú</cite>.</p>

<p>Sabino dejó claro que la velada es especial, al declarar que había sido la mejor noche del año y prometer que regresaría con más frecuencia a estos rumbos, lo que generó entusiasmo inmediato entre los asistentes.</p>

<p>Después más de dos horas de concierto, donde hizo cantar y grabar a más de 1,000 mil personas, Sabino decidió terminar por todo lo alto el concierto, y lo hizo con su gran éxito <cite>Película</cite>, armando el ambiente para la foto final y su despedida.</p>

<video controls width="100%" style="max-width: 560px;">
  <source src="https://i.imgur.com/2KsB6Vl.mp4" type="video/mp4">
</video>`,
    author: 'Marisol Ramirez',
    date: '2026-04-20T14:30:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://i.imgur.com/egQPv7e.jpeg',
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
    imageUrl: 'https://i.imgur.com/aVQcicv.jpg',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-010-2026-0003',
    title: 'CromaToluca: Tonos de una ciudad viva',
    summary: 'CromaToluca es un ensayo fotográfico periodístico que recorre algunos de los espacios más representativos de la capital mexiquense para mostrar cómo la historia, el patrimonio, la cultura y la vida cotidiana han construido su identidad. A través de distintas imágenes, el proyecto busca revelar los colores que permanecen en la memoria de la ciudad y que continúan dando significado a sus paisajes, símbolos y habitantes.',
    body: `<p>Toluca es una ciudad donde la historia, la tradición y el crecimiento urbano conviven diariamente. A través de sus espacios más representativos, es posible observar cómo se ha construido una identidad marcada por el patrimonio, la cultura y la vida cotidiana. Entre edificios, calles y paisajes, sobreviven colores adheridos a la memoria y al paso del tiempo. Algunos se manifiestan en espacios visibles; otros permanecen discretamente en la arquitectura, el movimiento de las personas y en aquello que cada generación deja sobre la ciudad. Más allá del concreto y de la rutina urbana, estos elementos continúan transformando la manera en que sus habitantes observan y habitan su entorno.</p>

<img src="https://i.imgur.com/6C9j3nZ.jpeg" alt="Nevado de Toluca / Xinantécatl" />

<p><strong>Nevado de Toluca / Xinantécatl</strong></p><p>Desde Sierra Morelos, localizado en Zinacantepec, puede apreciarse el Nevado de Toluca, una de las formaciones naturales más importantes del Estado de México. Para los pueblos prehispánicos del valle, el Xinantécatl tenía un carácter ceremonial y simbólico, convirtiéndose con el tiempo en uno de los principales referentes naturales e identitarios de la región.</p>

<p><a href="https://maps.app.goo.gl/ZAprMy9s4YKC8SmF8?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/HIWmhxj.jpeg" alt="Iglesia del Carmen" />

<p><strong>Iglesia del Carmen (1698)</strong></p><p>En el centro histórico se encuentra la Iglesia del Carmen, parte importante del legado colonial de la ciudad. Además de su relevancia religiosa, funcionó como espacio de convivencia social durante la época virreinal. Su arquitectura y sus tonalidades cálidas continúan destacando dentro del paisaje urbano contemporáneo.</p>

<p><a href="https://maps.app.goo.gl/NZaNdAEg8dgoM6nR9?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/ebmEEBq.jpeg" alt="Catedral de Toluca" />

<p><strong>Catedral de Toluca (1867 – inicio de construcción actual)</strong></p><p>Frente a la Plaza de los Mártires se levanta la Catedral, uno de los espacios más representativos de la ciudad. Su construcción refleja el crecimiento urbano y social que tuvo la capital mexiquense durante el siglo XIX, convirtiéndose en un punto clave para la vida pública y religiosa de la población.</p>

<p><a href="https://maps.app.goo.gl/xXXztoMP6GZFRVB69?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/8KtLQ3L.jpeg" alt="Palacio de Gobierno del Estado de México" />

<p><strong>Palacio de Gobierno del Estado de México (1969)</strong></p><p>Sobre la Plaza de los Mártires también se encuentra el Palacio de Gobierno, símbolo de la consolidación política de la entidad mexiquense. Además de su función administrativa, el edificio conserva murales que representan distintos momentos históricos y sociales del estado.</p>

<p><a href="https://maps.app.goo.gl/hMFacPv77gXvgvwM7?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/YnlmiHw.jpeg" alt="Portales y comercio tradicional" />

<p><strong>Portales y comercio tradicional (Siglo XIX)</strong></p><p>Dentro del centro histórico, los Portales han sido durante décadas uno de los espacios comerciales más importantes de la ciudad. Las dulcerías tradicionales representan la permanencia de costumbres y actividades económicas que continúan formando parte de la identidad cotidiana de la región.</p>

<p><a href="https://maps.app.goo.gl/7r7AyV2TbKgJozxVA?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/KYKHGRQ.jpeg" alt="Cosmovitral" />

<p><strong>Cosmovitral (1980)</strong></p><p>Sobre la avenida Sebastián Lerdo de Tejada se localiza el Cosmovitral, un espacio que nació a partir de la transformación de un antiguo mercado en uno de los sitios culturales más importantes del Estado de México. Sus vitrales, diseñados por Leopoldo Flores, integran naturaleza, arte y luz dentro de uno de los principales símbolos contemporáneos de la ciudad.</p>

<p><a href="https://maps.app.goo.gl/TA293SjTJrw2n7Yr9?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/c5XDJzf.jpeg" alt="Estadio Nemesio Diez" />

<p><strong>Estadio Nemesio Diez (1954)</strong></p><p>En la avenida Morelos se encuentra el Estadio Nemesio Diez, uno de los espacios deportivos más importantes de la capital mexiquense. Además de ser la casa del equipo masculino y femenino de los Diablos Rojos del Toluca, el estadio se ha convertido en un lugar de encuentro donde miles de personas comparten emoción, identidad y sentido de pertenencia a través del fútbol.</p>

<p><a href="https://maps.app.goo.gl/3MNEsG4SSn1uP8Qa9?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/ZXl1L9E.jpeg" alt="Torres Bicentenario" />

<p><strong>Torres Bicentenario (2008)</strong></p><p>A un costado de Paseo Tollocan se levantan las Torres Bicentenario, representando parte del crecimiento moderno y urbano de la ciudad. Su diseño contemporáneo refleja la transformación visual de un espacio que continúa expandiéndose y modificando constantemente su paisaje.</p>

<p><a href="https://maps.app.goo.gl/23QuvxKdnm8rjxWX8?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<img src="https://i.imgur.com/wwSbqed.jpeg" alt="Tren y zona industrial" />

<p><strong>Tren y zona industrial (Desarrollo industrial consolidado durante el siglo XX)</strong></p><p>La zona industrial, extendida principalmente hacia Paseo Tollocan y Lerma, impulsó el crecimiento económico de la región durante el siglo XX. El ferrocarril y la industria marcaron una etapa importante de modernización y conexión con otras partes del país, transformando el desarrollo urbano y laboral del valle mexiquense.</p>

<p><a href="https://maps.app.goo.gl/pnErVqVR1DErFe5T6?g_st=ic" target="_blank" rel="noopener noreferrer">📍 Ver en Google Maps</a></p>

<p>La identidad de Toluca se construye a partir de espacios históricos, culturales y cotidianos que continúan dejando huella en la memoria colectiva. Más allá del concreto, permanecen tradiciones, símbolos y colores que siguen dando significado a la manera en que las personas viven, recorren y recuerdan su entorno.</p>`,
    author: 'Rodrigo Segura',
    date: '2026-05-28T10:00:00Z',
    category: 'patrimonio',
    imageUrl: 'https://i.imgur.com/8KtLQ3L.jpeg',
    readTimeMinutes: 5,
  },
  {
    articleId: 'av-011-2026-0003',
    title: 'El latido del Tecuani: identidad en Santa María Jajalpa',
    summary: 'El eco del tambor en el atrio de la iglesia de Santa María Jajalpa, Estado de México, advierte que no se trata de un baile común. Este espacio sagrado se transforma cada año en el epicentro de un teatro callejero que desborda adrenalina, música y fervor popular.',
    body: `<p>La atmósfera musical no depende de una gran orquesta. Toda la energía del ambiente nace de apenas dos elementos: un tambor pequeño y una flauta modificada. Apoyados por micrófonos y bocinas colocadas alrededor del atrio, este dueto instrumental se basta para guiar el ritmo de la cacería y mantener la atención absoluta de los asistentes</p>

<p>Aunque esta representación no es originaria de la localidad, los habitantes la cobijaron con tanto misticismo que terminó por convertirse en el pilar indiscutible de las fiestas patronales en honor a la Virgen de la Natividad, consolidándose como una de las expresiones culturales más valiosas del pueblo.</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/OQnZYLsrPpA" title="Danza de los Tecuanes - Santa María Jajalpa" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<p>El relato escénico revive la amenaza del tecuani (el jaguar), una fiera astuta que invade los terrenos del hacendado Salvadorchi para devorar a sus animales. Esto desata una frenética persecución donde cada personaje cumple un rol clave: Agustinci y Juan Tirador, los rastreadores principales encargados de buscar el rastro de la fiera; el viejo rastrero, los lazadores, el flechero y el lancero, personajes que inyectan dinamismo, tensión y dramatismo a la coreografía; y el doctor, la figura que introduce la nota humorística al atender de forma cómica a quienes resultan heridos por los zarpazos del felino.</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/9NvE7zKO_cc" title="Danza de los Tecuanes - Short" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<p>Durante el festejo, el público se vuelve cómplice de los danzantes; la audiencia ríe y se emociona mientras el jaguar escapa y contraataca una y otra vez, todo bajo el cobijo del ritmo hipnótico e insistente de la música.</p>

<p>La historia alcanza su clímax cuando la bestia es finalmente acorralada y vencida en su escondite. El acto concluye formalmente con la llegada simbólica de los zopilotes y la recompensa que Salvadorchi entrega a sus cazadores.</p>

<p>Sin embargo, el verdadero triunfo de la festividad no radica en la caída del felino, sino en su valor social. La danza de los Tecuanis funciona como un vínculo intergeneracional que mantiene viva la memoria y la identidad colectiva de Santa María Jajalpa. Por eso, cuando el silencio regresa al atrio y las máscaras se guardan, queda la certeza de que el espíritu del tecuani nunca se marcha del todo.</p>`,
    author: 'Francisco Mireles',
    date: '2026-05-28T10:00:00Z',
    category: 'festividades-locales',
    imageUrl: 'https://i.imgur.com/cexWjZa.jpeg',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-013-2026-0003',
    title: '¿Evolución o pérdida de identidad?',
    summary: 'Lo que durante años fue una celebración ligada al campo y a la devoción religiosa, hoy enfrenta un cambio y abre un debate ante la llegada de tradiciones provenientes de otros municipios.',
    body: `<p>Cada mes de mayo, la localidad de san Mateo Otzacatipan celebra una de sus principales festividades: el paseo en honor a San Isidro Labrador patrono de los agricultores y campesinos. Para los habitantes de mayor edad, esta tradición representa una ofrenda dedicada al santo con la intención de pedir buenas temporadas de siembra y cosechas abundantes. Sin embargo, con el paso de los años, esta celebración ha tenido diferentes modificaciones.</p>

<p>En sus inicios, el paseo estaba conformado principalmente por la imagen de San Isidro Labrador, la mayordomía encargada de la festividad, una danza de apaches y por las yuntas, que eran una pareja de animales unidos mediante un yugo y que eran utilizados para labrar y arar la tierra del campo.</p>

<p>Con el tiempo, al recorrido se fueron agregando más danzas, mojigangas, carros alegóricos, tractores y sonidos, que recorrían las calles del pueblo. Aunque estos elementos no formaban parte de la celebración original la intención del paseo continuaba siendo la misma: ofrecer una ofrenda al santo para pedir un buen temporal y cosechas favorables.</p>

<p>Sin embargo, para algunos habitantes, el paseo realizado en 2026 marcó un cambio más evidente dentro de la festividad. La señora Leticia Hidalgo, habitante de la comunidad, expresó su inconformidad ante la incorporación de elementos que, asegura, no pertenecen a las tradiciones de San Mateo Otzacatipan.</p>

<p><q>Esas no son costumbres de nuestro pueblo, los monstruos son de San Francisco Tlacilalcalpan</q>, comentó.</p>

<img src="https://i.imgur.com/chFeH4b.jpeg" alt="Paseo de San Isidro Labrador 2026" />

<p>Otras habitantes coinciden con esta postura y consideran que el paseo ha dejado de ser principalmente una celebración religiosa para convertirse en un espacio de desorden. Además, señalaron que este año hubo una mayor presencia de <q>monstruos</q> y menos danzas tradicionales, elementos que anteriormente tenían mayor protagonismo dentro del recorrido.</p>

<blockquote>
<p>El paseo ya no es lo mismo. Ni siquiera los mayordomos tienen conciencia de la responsabilidad que implica la festividad. No hubo seguridad para los participantes y durante el recorrido algunos de ellos ya iban en estado de ebriedad. Son los mismos mayordomos quienes generan el desorden.</p>
<cite>— Joven habitante de la comunidad</cite>
</blockquote>

<p>El habitante también señaló que, anteriormente, quienes asumían la mayordomía contaban con experiencia dentro de la organización religiosa y comunitaria, mientras que actualmente, considera, algunas personas son elegidas únicamente por relaciones personales, situación que afirmase reflejó en la falta de control y organización durante el paseo.</p>

<p>A pesar de las opiniones divididas, el paseo de San Isidro Labrador continúa siendo una de las celebraciones más representativas de San Mateo Otzacatipan, ya que reúne tanto el sentido religioso como la identidad cultural de la comunidad. No obstante, los cambios que ha experimentado en los últimos años han abierto un debate entre los habitantes sobre la importancia de conservar las tradiciones originales y el rumbo que tomará la festividad en las nuevas generaciones.</p>`,
    author: 'Rosario Romero Pérez',
    date: '2026-05-17T10:00:00Z',
    category: 'festividades-locales',
    imageUrl: 'https://i.imgur.com/wnyZyei.jpeg',
    readTimeMinutes: 3,
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
  },
  {
    articleId: 'av-012-2026-0003',
    title: 'Gente del centro: El latido oculto en el corazón de Toluca',
    summary: 'Un viaje periodístico y fotográfico al corazón de Toluca que rinde homenaje a sus rostros anónimos, crónicas mudas e historias invisibles. Más allá del bullicio comercial y el frío de su arquitectura, este ensayo retrata la verdadera identidad y la poesía urbana de la capital mexiquense, invitando al lector a romper la rutina y redescubrir la magia oculta en las calles de su vibrante centro histórico.',
    body: `<p>Toluca no se erige únicamente sobre la sobriedad de su cantera, el frío de sus calles o el bullicio de sus comercios. Su verdadero espíritu respira en los rostros anónimos que, día con día, tejen el mapa invisible de su centro histórico. Entre el rugido de los motores y la tiranía del reloj, habitan crónicas mudas: el acorde de una guitarra solitaria, las manos agrietadas de un viejo trabajador o la risa efímera de una familia que cruza el asfalto. Este recorrido es un homenaje a esos instantes suspendidos en el tiempo, a la poesía urbana que la prisa cotidiana nos impide ver, pero que define el pulso real de la capital mexiquense.</p>

<img src="https://i.imgur.com/aw1FVtq.jpeg" alt="El hombre inmóvil" />

<p><strong>El hombre inmóvil</strong></p><p>Mientras el mundo corre desbocado a su alrededor, él permanece inmutable. Los artistas urbanos del centro son faros de quietud en un mar de rostros difusos. Convierten la banqueta gris en un escenario sagrado, desafiando el vértigo de la modernidad con una mirada fija y un cuerpo congelado que obliga a los transeúntes, aunque sea por un destello, a detener el tiempo y mirarse a sí mismos.</p>

<img src="https://i.imgur.com/8b3bpnf.jpeg" alt="El refugio de las generaciones" />

<p><strong>El refugio de las generaciones</strong></p><p>Bajo los icónicos arcos coloniales se respira la verdadera identidad toluqueña. Los Portales no son solo arquitectura; son el epicentro de los encuentros fortuitos. Aquí se cruzan el abuelo que arrastra los pies y los recuerdos, el vendedor que ofrece el dulce tradicional de la nostalgia, y el joven que camina de prisa hacia el futuro. Es un santuario vivo donde el pasado y el presente conversan en voz baja.</p>

<img src="https://i.imgur.com/Zg1w4zF.jpeg" alt="Melodías de la prisa" />

<p><strong>Melodías de la prisa</strong></p><p>Una guitarra desgastada y una voz rasposa cantándole a la indiferencia. La música callejera es el soundtrack invisible de Toluca. Los músicos plantan su trinchera de arte en las esquinas, regalando acordes a una multitud sorda que avanza a contrarreloj. Ellos no tocan buscando el gran escenario; tocan para recordarle a las calles que, a pesar del caos, todavía tienen alma.</p>

<img src="https://i.imgur.com/qDIdXKA.jpeg" alt="El carnaval de lo cotidiano" />

<p><strong>El carnaval de lo cotidiano</strong></p><p>La rutina se rompe con fogonazos de color, ingenio y excentricidad. Un personaje caricaturesco que baila sin ritmo en una esquina, el aroma a comida tradicional que inunda el aire y la decoración improvisada de un local independiente. Son pequeñas revoluciones visuales, destellos de cultura popular que rescatan al ciudadano de la monotonía grisácea y demuestran que el ingenio siempre encuentra una grieta para florecer.</p>

<img src="https://i.imgur.com/bJ0oAe1.jpeg" alt="Arterias de asfalto" />

<p><strong>Arterias de asfalto</strong></p><p>Las calles que conducen al corazón de la ciudad son ríos humanos en constante ebullición. Estudiantes con mochilas cargadas de ilusiones, comerciantes que empujan el día con el cuerpo y oficinistas que persiguen el transporte público. En este hormiguero urbano, la velocidad es la ley suprema y el trayecto mismo se convierte en el destino.</p>

<img src="https://i.imgur.com/WCRtkjM.jpeg" alt="Espera" />

<p><strong>Espera</strong></p><p>Incluso en el vórtice más concurrido de la ciudad, existe el vacío. Entre el caos, un oficial de policía permanece firme, resguardando el entorno pero habitando su propio silencio. Son pausas humanas que nadie más nota. La prisa urbana aísla; en medio de miles de almas, el centro también aloja esos islotes de melancolía y reflexión que se ahogan discretamente detrás de un uniforme o de una mirada perdida en el bullicio general.</p>

<img src="https://i.imgur.com/uiaLxEO.jpeg" alt="Oficios invisibles" />

<p><strong>Oficios invisibles</strong></p><p>Hay manos que sostienen la memoria y el calzado de la ciudad. El tintineo rítmico del cepillo contra el cajón del bolero es un eco del ayer que se resiste a desaparecer en la era digital. Estos oficios tradicionales, cobijados por miradas sabias y cansadas, sostienen la economía más humana y digna del centro, aunque la soberbia de la prisa a menudo los vuelva invisibles.</p>

<img src="https://i.imgur.com/82heR03.jpeg" alt="Regreso" />

<p><strong>Regreso</strong></p><p>Cuando el sol cae y las luces de los comercios comienzan a parpadear, el centro revela su verdad más honesta. No son los monumentos ni los grandes edificios lo que le dan vida, sino la familia que camina de la mano rumbo a casa, o el trabajador que exhala un suspiro al terminar su jornada. Toluca pertenece a quienes la caminan, la sufren y la aman. Al final del día, la ciudad no está hecha de piedra: está hecha de carne, hueso y esperanza.</p>

<p>Al cerrar este recorrido visual, queda claro que el centro de Toluca es mucho más que la suma de su arquitectura o el vaivén incesante del comercio. Es, en realidad, un mosaico efímero de almas donde cada personaje aporta un fragmento indispensable a la identidad colectiva. La lente ha logrado congelar aquello que la prisa cotidiana insiste en robarnos: la profunda humanidad que late en los momentos de pausa, recordándonos que la capital mexiquense no se define por la frialdad de su concreto, sino por el calor de las crónicas anónimas que resguardan sus banquetas.</p>

<p>Este ensayo fotográfico funciona, en última instancia, como un espejo y una tregua en medio del caos. Nos convoca a dejar de ser simples náufragos del asfalto para convertirnos en testigos empáticos de nuestro propio entorno, recordándonos que el espacio público cobra sentido solo a través de quienes lo habitan. Porque mientras las calles del corazón de la ciudad sigan albergando la dignidad de los oficios que resisten al tiempo, el color de sus expresiones populares y la sutil melancolía de las miradas perdidas, Toluca continuará siendo un espacio intensamente vivo; un hogar compartido donde, en medio de la multitud, basta un segundo de verdadera observación para volver a reconocernos humanos.</p>`,
    author: 'Francisco Mireles',
    date: '2026-05-28T10:00:00Z',
    category: 'historias-familiares-o-comunitarias',
    imageUrl: 'https://i.imgur.com/qDIdXKA.jpeg',
    readTimeMinutes: 7,
  },
  {
    articleId: 'av-014-2026-0003',
    title: 'La primera caminata por el lupus en San Mateo Atenco para visibilizar la enfermedad',
    summary: 'Se une la sociedad civil para organizar una caminata que permita alzar la voz de todas las personas que viven con lupus y otras enfermedades autoinmunes.',
    body: `<p>En México, el Registro Mexicano de Lupus estima que 20 de cada 100,000 personas padecen lupus, aunque no existe un censo oficial. De acuerdo con el medio "El Sol de Toluca", si se toma como referencia una prevalencia aproximada… "cerca de tres mil 400 pacientes con lupus se ubicarían en el Edomex".</p>

<p>En el marco del Día Mundial del Lupus, se realizaron actividades de concientización en la región centro del Estado de México. Una de ellas fue la primera caminata por la visibilización del lupus, organizada por la asociación civil EDUSAN, Realidad Lúpica A.C. Sede San Mateo Atenco y la red de apoyo Somos Valientes Toluca, colectivos que trabajan en favor de pacientes y familiares.</p>

<img src="https://i.imgur.com/SgufHus.jpeg" alt="Caminata por el lupus en San Mateo Atenco" />

<p>La caminata se llevó a cabo el jueves 28 de mayo de 2026 en la Explanada de San Pedrito de San Mateo Atenco, con la presencia de aproximadamente 30 personas entre pacientes, familiares y acompañantes. Alejandra Azucena Romero, directora de Realidad Lúpica A.C., expresó:</p>

<blockquote>
<p>La primera caminata por la visibilización del lupus fue posible gracias a cada paciente, familiar, voluntario y amigo que se sumó porque esta causa es nuestra, y hoy se sintió más viva que nunca.</p>
<cite>— Alejandra Azucena Romero, directora de Realidad Lúpica A.C.</cite>
</blockquote>

<p>La jornada buscó sensibilizar a la población y respaldar la iniciativa de la Ley Lupus en el Estado de México, que pretende garantizar atención integral y combatir la discriminación hacia quienes padecen enfermedades autoinmunes.</p>

<img src="https://i.imgur.com/KqBnXcF.jpeg" alt="Participantes de la primera caminata por el lupus en San Mateo Atenco" />

<p>Los colectivos adelantaron que continuarán impulsando actividades de visibilización y diálogo, como las Brazada por los Derechos de las Personas con Lupus, con la expectativa de que la legislación avance y se traduzca en mejores condiciones de vida para los pacientes en la entidad.</p>`,
    author: 'Marisol Ramirez',
    date: '2026-05-28T10:00:00Z',
    category: 'historias-familiares-o-comunitarias',
    imageUrl: 'https://i.imgur.com/uQ5UTg1.jpeg',
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
  console.log(`Seeded ${sampleArticles.length} articles across categories: arte-visual, arte-escenico, cine-y-audiovisual, festividades-locales, historias-familiares-o-comunitarias, gastronomia, patrimonio, identidad, agenda-cultural`);
}

seedDatabase().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});