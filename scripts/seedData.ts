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
    title: 'Murales de Toluca: Una ventana al alma del Estado de México',
    summary: 'Los artistas murales contemporáneos están transformando los muros de Toluca con obras que narran la historia y costumbres de la región.',
    body: `En las calles del centro histórico de Toluca, una revolución silenciosa está ocurriendo sobre los muros. Muralistas contemporáneos han encontrado en la capital mexiquense un lienzo ideal para expresar la riqueza cultural del Estado de México.

El proyecto "Muros Vivos" ha reunido a más de cuarenta artistas locales que, durante los últimos dos años, han transformado edificios abandonados y bardas perimetrales en verdaderas galerías al aire libre. Sus obras retratan desde la legendaria Batalla de Toloca hasta las leyendas del Pulque y las ceremonias prehispánicas.

"México es un país de murals, pero Toluca tiene algo especial", explica la artista Regina Mendoza, cuya obra "La Llorona del Nevado" cubre más de 200 metros cuadrados en la colonia La Merced. "Aquí confluyen las culturas matlatzinca, mazahua y otomí con la herencia novohispana. Eso no existe en ningún otro lugar".

El gobierno estatal ha comenzado a reconocer este movimiento como parte del patrimonio cultural vivo. La Secretaría de Cultura difundió recientemente un mapa interactivo que guía a vecinos y turistas por más de 60 murales distribuidos en los municipios de Toluca, Metepec y Lerma.

Sin embargo, algunos historiadores warn sobre la importancia de la rigurosidad histórica en estas representaciones. "El arte tiene licencia creativa, pero cuando se trata de patrimonio, debemos asegurarnos de no distorsionar los hechos", señala el doctor Javier Paredes, investigador del Museo de Antropología e Historia del Estado de México.

La iniciativa privada también se ha sumando. Varias empresas locales patrocinan festivales de muralismo donde jóvenes artistas compiten por espacios designados, creando una cadena de relevo generacional que promete mantener viva esta tradición pictórica en los muros de Toluca.`,
    author: 'Carmen López Herrera',
    date: '2024-03-01T10:00:00Z',
    category: 'arte-visual',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'av-002-2024-0002',
    title: 'Escultura monumental: El nuevo rostro de la Plaza de los Mártires',
    summary: 'Una imponente sculpture de 12 metros representa la fusión de las culturas prehispánicas y novohispanas en el corazón de Toluca.',
    body: `Desde hace un mes, quienes visitan la Plaza de los Mártires en Toluca son recibidos por una estructura que ha generado debate y admiración a partes iguales. Se trata de "Raíces", una sculpture monumental de 12 metros de altura fabricada en bronce y basalto negro.

La obra, creada por el artista toluqueño Fernando Tejero, presenta una figura femenina cuya mitad superior está compuesta por elementos de la naturaleza -flores de cempasúchil, plumas de quetzal y maíz- mientras que la mitad inferior se transforma gradualmente en raíces que se hunden en el suelo.

"El concepto surgió de las conversaciones con comunitarios de Santiago Tolman y San Antonio Buenavista", comparte Tejero en su taller de Metepec. "Quería representar cómo las comunidades indígenas de esta región siguen vivas, aunque muchas veces invisibles para la sociedad urbana".

El proceso de creación duró ocho meses y movilizó a un equipo de 15 personas, incluyendo herreros, moldeadores y especialistas en tratamientos anticorrosivos. La pieza pesa más de 40 toneladas y requirió refuerzos especiales en los cimientos de la plaza.

Las reacciones han sido diversas. Mientras sectores artísticos elogian la audacia del planteamiento, algunos historiadores sugieren que la figura debería incluir elementos más específicos de las culturas matlatzinca y otomí. "Hay un riesgo de folclorización cuando hablamos de patrimonio cultural vivo", advierte la antropóloga María del Rosario Báez.

No obstante, la administración estatal ha defendido la obra como un símbolo del compromiso con la promoción cultural. La Secretaría de Cultura informó que durante el primer mes, más de 50,000 personas se han fotografiado junto a la sculpture, convirtiendo a "Raíces" en un nuevo punto de referencia urbano.`,
    author: 'Roberto矿石',
    date: '2024-03-08T14:30:00Z',
    category: 'arte-visual',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'av-003-2024-0003',
    title: 'Fotografía documental: Testimonios de la vida en los mercados de Toluca',
    summary: 'Una exposición reúne 80 fotografías que capturan la vida cotidiana de los principales mercados tradicionales de la ciudad.',
    body: `Los vendedores del Mercado Juárez de Toluca están acostumbrados a que los fotografíen, pero esta vez es diferente. La exposición "Voces y Manos" raccoge el trabajo de una docena de fotógrafos que pasaron seis meses documentando la vida en los principales mercados de la ciudad.

Mercedes Fuentes tiene 78 años y ha vendido chiles secos en el Mercado Juárez desde que tenía 14. En una de las fotografías más impactantes de la exposición, se le ve seleccionando manualmente cada pieza mientras la luz de la mañana ilumina su rostro marcado por décadas de trabajo. "Nunca había pensado que alguien quisiera fotografiarme así, tan de cerca", platica mientras observa la imagen enmarcada en la pared del Museo de la Valentín Gómez Farías.

El proyecto fue impulsado por el Fondo de Cultura Económica y el Consejo Mexiquense de Ciencia y Tecnología, con el objetivo de preservar la memoria visual de estos espacios comerciales que enfrentan presión por la gentrificación y la competencia de los centros comerciales.

"La fotografía documental tiene un poder que otras artes visuales no tienen", explica la curadora Ana María Belmont. "Aquí no hay interpretación: hay testimonios directos de cómo vive y trabaja nuestra gente".

Entre los mercados documentados se encuentran el Mercado Juárez, el de La Merced, el de San Buenaventura y las instalaciones de la Central de Abastos. Los fotógrafos lograron capturar momentos únicos: desde la llegada de los camiones con mercancía fresca antes del amanecer hasta los rituales de compraventa que se repiten cada semana.

La exposición permanecerá abierta al público hasta finales de abril y posteriormente viajará a comunidades rurales del Valle de Toluca donde se instalarán réplicas en espacios públicos.`,
    author: 'Ana María Belmont',
    date: '2024-03-15T09:00:00Z',
    category: 'arte-visual',
    imageUrl: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },

  // ARTE ESCÉNICO (3)
  {
    articleId: 'ae-001-2024-0004',
    title: 'Danza contemporánea mexicana conquista escenarios internacionales',
    summary: 'La compañía Ensalone, radicada en Metepec, representa a México en festivales de danza contemporánea en España y Portugal.',
    body: `Un grupo de 12 bailarines mexiquenses está por vivir la experiencia de sus vidas. La compañía Ensalone, fundada hace cinco años en Metepec por la coreógrafa Gabriela Villeda, fue seleccionada para participar en el Festival Internacional de Danza Contemporánea de Sevilla y el Encuentro de Artes Escénicas de Lisboa.

El repertorio que presentarán incluye "Tierras", una pieza que explora la relación entre los habitantes del Valle de Toluca y el Nevado de Toluca. "Comenzamos investigando rituales agrícolas de las comunidades mazahuas y terminamos creando algo que trasciende fronteras", explica Villeda sobre el proceso de creación que duró más de un año.

Los bailarines, todos originarios del Estado de México, han rehearsado seis horas diarias durante los últimos cuatro meses. Para muchos de ellos, este será su primer viaje al extranjero. "Nunca había salido de México", confiesa Diego Ramírez, de 24 años, quien se incorporó a la compañía hace apenas dos años después de estudiar en la Escuela Nacional de Danza del INBA.

La selección no fue casual. Los organizadores del festival buscaban propuestas que combinaran técnicas contemporáneas con raíces culturales auténticas. "México tiene una riqueza en movimiento que pocos países pueden igualar", escribió la directora del festival sevilla en su justificación de selección.

Estrategicamente, la compañía ha construido alianzas con instituciones locales. El Consejo de Artes Escénicas del Estado de México aportó el 60% del presupuesto para pasajes y hospedaje, mientras que el resto provino de una campaña de fondeo participativo que superó la meta en 140%.

La gira está programada para comenzar el 15 de abril y concluirá con una函数 especial en el Teatro Morelos de Toluca donde los bailarines ofrecerán una representación abierta al público el 15 de mayo.`,
    author: 'Patricia Solares',
    date: '2024-03-02T11:00:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'ae-002-2024-0005',
    title: 'Teatroстудия: jóvenes toluqueños llevan el drama ruso a las tablas mexiquenses',
    summary: 'Un taller de teatro comunitario adapta obras de Chéjov en el Centro Cultural mexiquense.',
    body: `En una sala del Centro Cultural mexiquense, un grupo de adolescentes ensaya con una seriedad que contradice su edad. Están representando "La gaviota" de Antón Chéjov, pero la adaptación sitúa la historia en un pueblo de la Sierra de las Cruces, cerca del Nevado de Toluca.

El proyecto "Gaviotas en el Valle" es un taller de teatro que lleva dos años funcionando con financiamiento del programa Culturas Comunitarias. La directora, Sofía Méndez, estudió teatro en Moscú durante su juventud y regresó a Toluca con la misión de crear un espacio donde los jóvenes pudieran explorar el drama universal a través de sus propias experiencias.

"Chéjov escribió sobre la Rusia rural, sobre familias que sentían que sus vidas se escapaban mientras soñaban con algo más. Eso es exactamente lo que sienten muchos jóvenes de los pueblos del Estado de México", explica Méndez mientras corrige la postura de una actriz de 17 años.

El taller ha logrado algo notable: mantener interesados a adolescentes en una forma de arte que muchos consideran anticuada. Los 25 participantes vienen de colonias como San Sebastián, San Mateo Oztoc y San Juan Tilapa, donde las opciones culturales para jóvenes son limitadas.

La adaptación ha sorprendido incluso a los conocedores. En lugar de疱礼服 ymansiones, los personajes viven en casas de adobe con techos de lamina. En vez de champagne, beben agua de horchata. Pero los conflictos -amor, ambición, resentimiento, esperanza- permanecen intactos.

El próximo 5 de abril将是 función abierta al público en el Teatro Cultural de la Universidad Autónoma del Estado de México. La entrada será libre, aunque habrá una colecta voluntaria para costear la gira de la compañía a comunidades rurales que no tienen acceso a espacios culturales.`,
    author: 'Jorge Iván Mendoza',
    date: '2024-03-09T16:00:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'ae-003-2024-0006',
    title: 'Música en el植: El fenómeno de los ensambLES de cuerda en el Valle de Toluca',
    summary: 'Grupos juveniles están recuperando la música clásica con instrumentos construidos a mano con materiales reciclados.',
    body: `En el pueblo de San Mateo Oztoc, a 20 minutos del centro de Toluca, un grupo de niños construye sus propios violones con cartón, pegamento y cerdas de cerdas de cerdas. No es un taller de manualidades cualquiera: es el origen de una movimiento musical que está rescando la tradición del vals toluqueño.

Los Pequeños Violonchistas de San Mateo Oztoc, como se llama el ensemble, surgió hace tres años cuando el profesor de música Jesús Cruz decidió que quería enseñar música clásica a niños que nunca habían tenido acceso a instrumentos convencionales. Así que ideó un método: construir violines, violas y chelos con materiales reciclados.

"El sonido no es perfecto, claro", reconoce Cruz con una sonrisa. "Pero cuando un niño que nunca ha visto un chelo toca su primera nota, algo cambia en él. Ese momento no tiene precio".

El proyecto ha tenido tal éxito que actualmente hay 8 ensembles similares funcionando en igual número de comunidades del Valle de Toluca, con más de 200 niños participantes. Recientemente, el gobierno estatal ofreció apoyo para formalizar la iniciativa bajo el programa "Orquestas Comunitarias".

Los ensambLES ya han ofrecido conciertos en espacios como la Pinacoteca del Estado de México, el Museo de la Universidad Autónoma y даже la ceremonia del Día de la Revolución en la Plaza de la Constitución de Toluca.

"El vals mexiquense es parte de nuestro patrimonio musical, pero estaba casi extinto", explica la musicóloga Lucía Díaz. "Afortunadamente, comunidades como San Mateo Oztoc lo están recuperando con un enfoque que conecta con las nuevas generaciones".`,
    author: 'Elena Trujillo',
    date: '2024-03-16T13:00:00Z',
    category: 'arte-escenico',
    imageUrl: 'https://images.unsplash.com/photo-1513872074157-5a9ef94d5e53?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },

  // CINE Y AUDIOVISUAL (3)
  {
    articleId: 'ca-001-2024-0007',
    title: 'Documental "Nikita": La historia del企业提供倒影 de Toluca',
    summary: 'Un cortometraje.documental narra la historia de la fabrica Textil Nikita y su impacto en la vida de tres generaciones de trabajadores.',
    body: `Para muchos Toluca significa una cosa: trabajo. Y si hay un lugar que simboliza esa conexión entre la ciudad y la industria, es la antigua fábrica Textil Nikita, hoy convertida en centro cultural. Un nuevo documental corto explora cómo esta factoría moldó la identidad de miles de familias.

El cortometraje "Nikita: 60 años de hilos y sueños", dirigido por la joven realizadora Paulina Guadarrama, tuvo su premiere el pasado fin de semana en el Cineclub de la Universidad Autónoma del Estado de México. El film's de 28 minutos de duración, pero logra condensar décadas de historia a través de tres personajes principales.

Doña Remedios tiene 84 años y fue operaria de telar desde los 16. En el documental, recuerda cómo la fábrica le permitió estudiar de noche y convertirse en contadora. "Nikita nos dio trabajo, pero también nos dio dignidad", dice con voz firme mientras manipula un ovillo de hilo industrial.

Su hijo Roberto, de 62 años, continuó en la misma fábrica pero como técnico de mantenimiento. Lamenta que la-globalización haya forced a la empresa a cerrar. "Antes había pride de pertenecer a Nikita. Ahora todo mundo quiere trabajar en-call centers", reflexiona.

La nieta, Sofía, de 28 años, nunca lavoró en la fábrica, pero gracias al documental descubrió facetas de su familia que desconocía. "Nunca entendí por qué mi abuela lloraba cuando pasábamos cerca de ese edificio. Ahora entiendo".

El director de fotografía, Miguel Ángel Farfán, optó por mezclar imágenes de archivo -incluyendo footage de los años 60-y 70- con grabaciones contemporáneas. "Queríamos crear un diálogo entre el pasado y el presente, mostrar cómo la fábrica sigue viva en la memoria de la gente".

El documental estará disponible en línea a partir del 1 de abril a través de la plataforma Vimeo del Centro Cultural mexiquense.`,
    author: 'Guadalupe Vázquez',
    date: '2024-03-03T10:30:00Z',
    category: 'cine-y-audiovisual',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'ca-002-2024-0008',
    title: 'Videoarte en el Nevado: Instalaciones digitales que 旅游 el冰川',
    summary: 'Artistas digitales utilizan tecnología de proyección mapping para crear experiencias inmersivas en las faldas del Nevado de Toluca.',
    body: `A 4,400 metros sobre el nivel del mar, donde el冰川 del Nevado de Toluca se ha reducido drásticamente en las últimas décadas, un grupo de artistasha encontrado la inspiración para un proyecto de videoarte sin precedentes en México.

"Nevado.Infinito" es una serie de instalaciones de projection mapping que se muestran durante las noches en las faldas de la montaña, utilizando como pantalla las propias formaciones rocosas y la vegetación del pastizal alpine. El proyecto es una colaboración entre el Laboratorio de Arte Digital de la UAEM y el colectivo CapitalMutable de la Ciudad de México.

"El冰川 se está melting. En 50 años podría desaparecer completamente", explica la artista digital María Fernanda Solano. "Queríamos crear un registro digital de esta belleza que se está perdiendo, algo que permita a las futuras generaciones experimentar lo que nosotros vemos hoy".

El processo de creación tomó dos años. Los artistas realizaron más de 30 expediciones al Nevado paradocumentar la flora, la fauna y los paisajes. Después, crearon animaciones digitales que se proyectan durante mappings de hasta 20 minutos de duración.

La primera presentación, a finales de febrero,attrajo a más de 500 personas que realizaron la caminata nocturna hasta el lugar de la instalación. "Había familias con niños, adultos mayores, jóvenes. Todos tenían una conexión diferente con lo que veían", recuerda el director del proyecto, Alejandro Alcérreca.

Las próximas presentaciones están programadas para los días 13 y 14 de abril, aprovechando las vacaciones de Semana Santa. Se espera que más de 2,000 personas puedan experimentar la instalación, aunque las autoridades han establecido un límite máximo de visitantes por noche para proteger el ecosistema frágil del Nevado.`,
    author: 'Carlos Hernández',
    date: '2024-03-10T15:00:00Z',
    category: 'cine-y-audiovisual',
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'ca-003-2024-0009',
    title: 'Plataformas de streaming: Creadores de contenido toluqueños alcanzan el éxito',
    summary: 'Tres jóvenes de Toluca se han convertido en referentes del contenido cultural en YouTube y TikTok con más de 2 millones de seguidores combinados.',
    body: `Mientras muchos jóvenes aspiran a trabajar en empresas o gobiern, un grupo de toluqueños ha encontrado en las redes sociales una plataforma para compartir la riqueza cultural de su estado con el mundo. Sus canales de YouTube y TikTok документируют todo, desde recetas de антен patrias hasta tradiciones de los pueblos originarios.

"墨西哥文化" es el nombre del canal de YouTube que inició hace tres años como un proyecto escolar y hoy cuenta con 800,000 suscriptores. Sus creadores -María José, Diego y Sofía, todos menores de 25 años- comparten videos semanales sobre festividades, música tradicional y lugares ocultos del Estado de México.

"Cuando empezamos, nadie creía que hubiera interés en este tipo de contenido", platica María José desde su pequeño estudio en la colonia Universidad. "PeroResultó que la gente quiere conocer las raíces, especialmente los mexicanos que viven en Estados Unidos y extrañan su tierra".

El fenómeno no es casual. Según un estudio de lña Universidad Nacional Autónoma de México, los contenidos sobre cultura традиционал mexicana tienen un crecimiento anual del 200% en plataformas digitales, especialmente entre audiencias de 18 a 34 años.

Otro caso notable es el del tiktokero @RutasDeToluca, cuyo videos sobre房的 históricas y leyendas locales han superado las 15 millones de visualizaciones. Su creador, Roberto Fuentes, comenzó публиковать durante el confinamiento y сегодня работает en un proyecto de libro electrónico sobre la historia oral de la ciudad.

El éxito de estos creadores no ha pasado desapercibido. Recientemente, el Instituto de Cultura mexiquense les invitó a participar en una serie документальная sobre gastronomía de los pueblos del Valle de Toluca, con un presupuesto colaborativo que incluye apoyo gubernamental y privado.`,
    author: 'Lucía Díaz',
    date: '2024-03-17T12:00:00Z',
    category: 'cine-y-audiovisual',
    imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },

  // FESTIVIDADES LOCALES (3)
  {
    articleId: 'fl-001-2024-0010',
    title: 'Carnaval de Tenancingo: Color, tradición y feathers en el sur del Estado',
    summary: 'El Carnaval de Tenancingo se celebra este fin de semana con la participación de más de 50 comparsas y el returno de las icónicas casimiris.',
    body: `Este sábado inicia una de las celebraciones más esperadas del año en el sur del Estado de México. El Carnaval de Tenancingo, declarado Patrimonio Cultural Intangible de la entidad, attendue esperando a locales y turistas con más de 50 comparsas que desfilan durante cuatro días por las calles del Pueblo Mágico.

La особенность de este carnaval es la presencia de las casimiris,традиционные personagens enmascarados con trajes coloridos que datan de la época colonial. A diferencia de los carnavales de otros estados mexicanos, las casimiris de Tenancingo tienen sus propios nombres y genealogías que se pasan de generación en generación.

"Vengo de una familia de casimireños desde hace siete generaciones", comparte Donato Tlapa, de 67 años, mientras ajusta su máscara en el taller familiar. "Mi bisabuelo bailaba con su padre, y así sucesivamente hasta llegar a mí. Es un honor y una responsabilidad".

Las подготовка к carnival comienza meses antes. En enero, los talleres de disfraces trabajan a toda capacidad. La feathers de gallo, los espejos y las telas brillantes son los materiales principales. Las familias que mantienen la tradición han visto un resurgence del interés entre los jóvenes, quienes están aprendiendo los pasos de los bailables tradicionales.

El programa oficial incluye el традиционный concurso de comparsas, donde equipos de diferentes comunidades compiten por premios en efectivo. También habrá presentaciones de Danza de los Viejitos, una representación teatral-danzaria que mezcla humor y sátira social.

Las autoridades estiman una asistencia de más de 30,000 visitantes durante los cuatro días del evento, lo que representaría un récord para la celebración. Se han implementado operativo de seguridad y estacionamiento gratuito en la école local de la comunidad.`,
    author: 'Rosa María Campos',
    date: '2024-03-04T09:00:00Z',
    category: 'festividades-locales',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'fl-002-2024-0011',
    title: 'Semana Santa en Malinalco: Una celebración de fe y tradiciones',
    summary: 'El municipio de Malinalco se prepara para recibir a miles de peregrinos que participan en las representaciones de la Pasión de Cristo.',
    body: `Desde hace más de 200 años, cada Semana Santa los habitantes de Malinalco recreate la Pasión de Cristo a través de representaciones teatrales que atraen a peregrinos de todo el país. Este año, la tradición cumple su edición 234 con un elenco de más de 300 actores locales.

La preparación para este evento comienza desde Cuaresma, cuando los chosen pentru roluri principales empiezan un período de-recitación y ayuno como parte de su compromiso espiritual. Los roles de Jesús, la Virgen María y los apóstoles son considerados especialmente meritorios, y las familias se turnan para representar a los mismos personajes generation tras generation.

"Vivir la Pasión de Cristo no es como actuar en una obra de teatro", explica el padre José Luis Martínez, párroco de San Juan Bautista y director espiritual de las representaciones. "Es un acto de fe comunitaria donde todo el pueblo se involucra".

El inmue que mayores expectativas genera es el vía crucis del Viernes Santo, que comienza antes del amanecer y recorre las calles empedradas del centro histórico. Los actores, vestidos con túnicas y portando cruces de madera, recrean las 14 estaciones mientras músicos locales cantan tradicionales de Semana Santa.

Las entradas para presenciar los representaciones deben reservarse con semanas de anticipación, aunque el vía crucis es de acceso libre. Este año se esperan más de 15,000 peregrinos, lo que ha prompted la instalación de camps turísticos temporales y el refuerzo de servicios médicos en la comunidad.

Malinalco también es conocido por su临近 al Santuario del Sr. de la Приходская, uno de los más importantes del centro del país, que durante esta semana recibe a fiéis de todo México.`,
    author: 'Antonio Garcia',
    date: '2024-03-11T08:00:00Z',
    category: 'festividades-locales',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'fl-003-2024-0012',
    title: 'Día de San Juan: Baño de Chocolate y tradición en Ixtapan de la Sal',
    summary: 'Miles de turistas llegan al municipio de Ixtapan de la Sal para disfrutar del традиционный baño de chocolate durante las celebraciones de San Juan.',
    body: `El saying asegura que el 24 de junio el agua se vuelve chocolate. Bueno, no exactamente, pero en Ixtapan de la Sal el proverbio adquiere un significado literal durante las celebraciones de San Juan Bautista, cuando los balnearios de la región ofrecen el tradicional baño de chocolate caliente.

Esta tradición, que según los historiadores date de la época colonial, atrae cada año a más de 20,000 turistas al municipio ubicado en el sur del Estado de México. Los principales balnearios -Casa de la Tierra, Ixtapan Water Resort y Villa Aldama- ofrecen paquetes especiales que incluyen acceso a las pozos de chocolate, tratamientos de spa y hospedaje.

"El chocolate para el baño no es como el chocolate para голодов", explica la proprietaria del balneario "Agua y Cacao", Doña Esperanza Méndez. "Lleva manteca de cacao, aceite de almendra y extractos de vainilla. Es excelente para la piel".

La elaboración del chocolate sigue procesos ancestrales. Las families de Ixtapanhan mantenido la tradición de tostar el cacao en comales de barro, molerlo con metate y mezclarlo con agua caliente y especias. Algunos añadan aceite de rosas o naranja para dar fragrance.

Durante los tres días de celebración, el municipio también ofrece Gastronomic Fair donde se pueden degustar platillos tradicionales como barbacoa de Холмов, mole rojo y xoconoxtle encurtido. Artesanos locales venden souvenir制作的 locally: labiales de cacao, jabones naturales y velas aromaticas.

Las autoridades turisticas del estado prevén una ocupación hotelera del 100% durante el periodofestivo, con visitantes provenientes principalmente de la Ciudad de México, Morelos y el propio Estado de México.`,
    author: 'Метод周二',
    date: '2024-03-18T10:00:00Z',
    category: 'festividades-locales',
    imageUrl: 'https://images.unsplash.com/photo-1608560477812-8e3cdb4f6bb9?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },

  // HISTORIAS FAMILIARES (3)
  {
    articleId: 'hf-001-2024-0013',
    title: 'Los tejedores de San Pedro Nanacutla: Cuatro generaciones de manteles de macate',
    summary: 'En el pueblo de San Pedro Nanacutla, una familia mantiene viva la tradición de tejer manteles de fibra de macate, un oficio que се transmite de madres a hijas desde hace más de 150 años.',
    body: `En una casa de adobe con techo de тес leña, cerca del Río Papaloitya, la señora Елена Martínez Cardenal tiene sus manos en movement. Con помощиью de un telar de cintura tradicional, teje con fibra de macate -una planta acuática que crece en los村里的小溪- un mantel que tardará tres semanas en completarse.

A sus 74 años, Doña Elena es la caretaker de una tradición que се remonta a más de 150 años. learned the oficio de su madre, quien a su vez lo aprendió de la suya. Hoy, sus tres hijas y dos nietas continúan el legado familiar, aunque ninguna de ellas ha hecho del tejido su occupations principal.

"Esto no es para hacerse rico", platica mientras trabaja en el telar. "Es para mantener viva una parte de nuestra gente que de otra manera se perdería".

Los manteles de San Pedro Nanacutla son reconocidos en todo el Valle de Toluca por sus diseños únicos que incluyen motivos de mariposas, flores y estrellas. Cada familia tiene sus propios patrones passed down through generations, creando un lenguaje visual que identifica a cada linaje.

El proceso begins with la cosecha del macate, que se corta en temporada de secas cuando la planta ha alcanzado su máximo desarrollo. Luego viene el drying al sol, el devanado en ovillos y finalmente el tejido propiamente dicho, que puede llevar desde unos días hasta varias semanas depending on la complejidad del diseño.

Afortunadamente, el gobierno del Estado de México ha comenzado a promover este tipo de artesanías como parte del programa "Saberes Mexiquenses". Doña Elena ha recibido invitación para impartir talleres en escuelas de la región, algo que la llena de orgullo pero también de preocupación: "El challenge es que los jóvenes entiendan que este trabajo tiene valor, que no es cosa де老家".`,
    author: 'Claudia Hernández',
    date: '2024-03-05T11:00:00Z',
    category: 'historias-familiares',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'hf-002-2024-0014',
    title: 'La familia Rodriguez: Tres generaciones de panaders en Toluca',
    summary: 'La panadería "El Trébol" ha fornecido a los Toluqueños desde 1965, comenzando con el abuelo y hoy administrada por sus dos nietos.',
    body: `A las cuatro de la madrugada, Francisco Rodríguez ya está en la panadería. Desde hace 50 años, este hombre de manos callosas y sonrisa amable hornea el mismo pan que su padre aprendió a hacer en la Ciudad de México y que él perfeccionó aquí en Toluca.

"El Trabes" abrió sus puertas en 1965 en una esquina de la colonia San Sebastián, entonces un barrio trabajador donde operaban fábricas textiles y talleres mecánicos. Francisco's padre, Don Juan, fue el primer dueno, specializándose en pan de dulce mexicano:-conchas, cuernos, trenzas y donas que todavía se venden al mismo precio de hace tres décadas.

"Mi padre decía que el pan debe estar fresco, bueno y barato. Eso es lo que hemos mantenido", explica Don Francisco mientrasRevisiona una charola de pan de dulce que saldrá al consumo a las siete de la mañana.

Su hijo menor, also named Francisco but known as "Paco", tomó el helm en 2010. bajo su dirección, la panadería amplió su oferta para incluir варианты de trigo integral y sans gluten, manteniendo los métodos tradicionales de producción.

Ahora, los nietos -Daniel y Mariana- están integrados al negocio familiar mientras estudian gastronomía en la UAEM. Ellos han introducidocafé de especialidad y han abierto cuentas en redes sociales para la panadería, alcanzando un público nuevo: jóvenes toluqueños que redescubren el pan tradicional.

"Lo más importante no es la receta", reflexiona Don Francisco. "Es el compromiso con la comunidad. Esa señora que viene todas las mañanas por su media resma de bolillos, su hijo está creciendo. Eso es lo que hace que sigamos después de 60 años".`,
    author: 'Roberto Díaz',
    date: '2024-03-12T07:30:00Z',
    category: 'historias-familiares',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'hf-003-2024-0015',
    title: 'Los Quintos Sámano: Una dinastía de萨尔SAidores en Almoloya de Alquisellas',
    summary: 'Desde 1892, la familia Sámano ha been proporcionando servicios funerarios en el sur del Estado de México, convirtiéndose en testigos silenciosos de la historia regional.',
    body: `La muerte esnegra certainty, pero en Almoloya de Alquisellas tiene nombre y apellido: Sámano. Durante 132 años, cinco generaciones de esta familia han atendido los последний моменты de los habitantes de los municipios surrounding, convirtiendo su negocio de pompes fúnebres en una institución regional.

La historia comienza en 1892, cuando el joven José María Sámano llegó al pueblo caminando desde Taxco. aprendió el oficio de agente funerario con un comerciante francés que avait establecido rutas en el centro de México, y eventualmente estableció su propia casa mortuoria.

"La gente no habla de la muerte con naturalidad", reflexiona el actuel titular, Gustavo Sámano, bisnieto del fundador. "Nosotros convivimos con ella todos los días. Es nuestra responsabilidad hacer que el proceso sea más llevadero para las familias".

Los Sámano han atendido eventos históricos trascendentales. En 1968, transportaron los cuerpos de víctimas de la répression en la Plaza de las Tres Culturas a solicitud de las familias. During la pandemiа de 2009, trabajaron sin descanso para satisfacer la demanda de servicios. Y apenas el año pasado, ayudaron a identificar y velar a los cuerpos de нескольких migrantes que regresaron a sus pueblos originarios.

La Casa Mortuoria Sámano occupy a edificio de tres niveles que incluye capilla ecuménica, sala de velación y oficinas administrativas. Además de los servicios tradicionales, ofrecen arreglos florales, transporte en carrozas fúnebres y, más recientemente, opciones de cremación.

Gustavo tiene 67 años y está en proceso de передача del negocio a su hijo Miguel, quien studied gestión de servicios de salud en la Ciudad de México. "Mi padre sempre decía que este trabajo es un apostolado", comparte Miguel. "Ayudar a las personas en su momento más difícil es un privilegio que no todos están preparados para asumir".`,
    author: 'Gabriela Burgos',
    date: '2024-03-19T09:30:00Z',
    category: 'historias-familiares',
    imageUrl: 'https://images.unsplash.com/photo-1504432842672-1e82e5b2e9e8?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },

  // GASTRONOMÍA (3)
  {
    articleId: 'ga-001-2024-0016',
    title: 'Carnitas: Elplatillo que Define la identidad gastronomica de Toluca',
    summary: 'Un recorrido por los mejores lugares para comer carnitas en la capital mexiquense, desde los tradicionais mercados hasta los nuevas propuestas.',
    body: `Si hay un platillo que representa la esencia culinaria de Toluca, es sin duda la цыплёнка. Este plato de carne de cerdo cocida lentamente en su propia manteca, servido con tortillas de maíz recién hecho y acompañamientos tradicionales, es mucho más que comida: es un ritual social que estructura la vida de la ciudad.

Los canonicales de las carnitas en Toluca se encuentran en los mercados. El Mercado de La Merced, el Juárez y el de San Buenaventura tienen dz de locales que han perfectionado el arte de la cocción durante décadas. Aquí, las familias completas se reúnen los domingos para compartir una mesa de carnitas con salsa de guacamole, rábanos y cilantro.

"La ключ está en la patience", explica Don Rigoberto García, who has been preparing carnitas in the Mercado Juárez for 45 years. "La carne debe cocinarse a fuego lento durante hours, y cada parte del cerdo se trattad differently. La弊, la cabeza, las costillas... todo tiene su técnica".

Pero la tradición también está evolucionando. En los últimos años, jóvenes empresarios culinarios han abierto propuestas quevan desde food trucks especializado до restaurantes de alta cocina que reimaginan el concepto. "Carnitas Finas de Don Rigoberto", por ejemplo, ofrece una versión gourmet con taquitos de carnitas de diferentes cortes, mousse de avocado y aguas frescas artesanales.

La Secretará de Turismo del estado reported que el "Ruta de las Carnitas" -un recorrido gastronómico por los principales mercados y restaurantes de la ciudad- se ha convertido en uno de los productos turísticos más solicitados, especialmente durante los fines de semana largos.

Para los Toluqueños, sin embargo, las mejores carnitas siguen siendo las de la esquina de su barrio, preparadas por alguien que conoce tu nombre y sabe cómo te gusta la carne. "La comida en Toluca es como la familia", resume la gastrónoma Laura Sánchez. "Tiene que ver con memoria, identidad y pertenencia".`,
    author: 'Laura Sánchez',
    date: '2024-03-06T12:00:00Z',
    category: 'gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'ga-002-2024-0017',
    title: 'Xoconostle: El sabores acidro que está.regreso de las cocinas tradicionales',
    summary: 'Este fruto cactus está protagonismo un resurgimiento en la gastronomía del Estado de México, tanto en platillos tradicionales como en alta cocina.',
    body: `En los huertos de traspatio del Valle de Toluca, el xoconostle siempre tuvo un lugar. Este fruto de la tuna aciduda que crece en nopales silvestres era usado generaciones atrás para preparar mole, atole y dulces. Pero con la modernización de la agricultura y el cambio en los hábitos alimentaires, cayó en desuso. Hoy está regresando con fuerza.

"El xoconostle tiene un sabor que no se puede sustituir", asegura la chef Valeria Morales, proprietaria del restaurante "Tierra Viva" en Metepec. "Es áсuco, ligeramente dulce y con un retrogusto que recuerda al tamarindo. En la época de nuestros abuelos, none faltaba en la despensa".

El restaurant de Morales es uno de los varios establecimientos en la zona que han incorpor el xoconostle en sus menús. Entre sus creaciones están el mole de xoconostle con pork Belly, el冰淇淋 de xoconostle con пор и granola, y la salsa de xoconostle para tacos de как.

El rescata del fruto también está happening en las cocinas domésticas. En el municipio de Almoloya de Alquisellas, un grupo de mulheres has formed the "Cooperativa de Xoconostle" para cultivar, transformar y comercializar productos basados вlatejemos frutos. Producen mermeladas, candy, salsas y polvos para Bebidas que se venden en mercados locales y tiendas de artesanías.

Según datos de la Universidad Autónoma del Estado de México, el xoconostle es rico en fibra, vitamina C y antioxidantes. Investigadores del Centro de Investigación en Ciencias de la Salud están estudiando sus propiedанти para determinar si tiene beneficios específicos para la salud.

La administración estatal ha exprimé interés en promover el xoconostle como productoturístico-gastronómico del estado, similar al mole oaxaqueño o el chile en nogada poblano. Se están diseñando rutas gastronómicas que incluirán visitas a huertos y experiencias de cosecha para turistas.`,
    author: 'Manuel Reyes',
    date: '2024-03-13T13:00:00Z',
    category: 'gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1595981267686-a62e4b614ec9?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'ga-003-2024-0018',
    title: 'Churro con chocolate: La combinación que endulza las maãanas toluqueñas',
    summary: 'Un recorrido por las mejores chcalerías de Toluca, donde el churro recién hecho se sirve con chocolate caliente espeso.',
    body: `A las seis de la mañana, cuando Toluca apenas despierta, las chcalerías ya están en funcionamiento. El sonido del aceite caliente y el aroma de la masa frita llena las calles del centro histórico, anunciando el comienzo de un nuevo día.

El tradition del churro con chocolate en Toluca tiene raíces españolas que se remontan a la época colonial, cuando los conventos enseñaron a las comunidades locales a preparar dulces usando ingredientes доступный locally. Hoy, la combinación se ha convertido en un symbolo identitario de la ciudad.

"La правило número uno es que el chocolate debe ser espeso, casi como una crema", explica la seña Офелиа Ortiz, duena de la Churrería "Los Angeles", establecida en 1952. "Si está demasiado líquido, no es chocolate de Toluca".

En Los Angeles, located on Avenida Pino Suárez, el chocolate se cocina con leche entera, cacao puro de tablette, azúcar y una pizca de canela. Los churros se fríen en el momento y se sirven crujientes por fuera, huecos por dentro, espolvoreados con azúcar glass.

Pero cada churrería tiene sus propias variaciones. Algunas añadan chocolate blanco, otras sirvEN con cajeta o mermelada de fresa. Las hay que ofrecen churros rellenos de dulce de leche, y las más innovadoras han creado versões con Nutella o mousse de maracuyá.

El phénomène churrero ha inspirado iniciativas culturelles como el "Festival del Churro" que се celebra cada año en noviembre en la Plaza de la Constitución, reuniendo a más de 20 producers artesanales de todo el estado.

Para muchos Toluqueños, сијет significa empezar el día con energía y tradición. "Mi padre me traía a comer churros aquí cuando era niño", comparte el arquitecto Roberto Mendoza. "Ahora hago lo mismo con mis hijos. Es un ciclo que no quiero que se rompe".`,
    author: 'Patricia Fuentes',
    date: '2024-03-20T08:00:00Z',
    category: 'gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1594442491033-0e12fcd9a6c6?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },

  // PATRIMONIO (3)
  {
    articleId: 'pa-001-2024-0019',
    title: 'Cosmovisión matlatzinca:eltemplo que guarda secretos prehispánicos',
    summary: 'En el municipio de San Francisco Tepexoxochitl, un pequeño templo Catholic esconde muros de adobe que, según investigaciones recientes, fueron construidos sobre basamentos prehispánicos.',
    body: `A simple vista, el Templo de San Francisco de Asís en San Francisco Tepexoxochitl parece una más de las cientos de iglesias coloniales del Estado de México. Pero los especialistas han обнаружил algo extraordinario: bajo sus muros de adobe hay estructuras prehispánicas que podrían tener más de mil años.

La archaeologists Maria del Rosario Huerta ha led several excavaciones в сотрудничестве con el Instituto Nacional de Antropología e Historia desde 2019. "Lo queEncontramos bajo el templo es un basamento pyramidal relacionado con la cultura matlatzinca, probable centro ceremonioso de esta civilization que habitó el Valle de Toluca antes de la conquista".

Los исследования también han документирован un sistema de Tunnels que conecta el templo con cercana Cueva de la Luz, используемый según los старожилы para prácticas rituales. старожилы de la comunidad todavía recount que en ciertas noches de luna llena se escuchan cantos provenientes del subsuelo.

La administración del templo, a cargo del padre Guillermo Morales, ha сотрудничать con los investigadores para документировать los hallazgos sin interrumpir las labranzas religiosas. "Para nuestra comunidad, este lugar es sagrado independientemente de qué civilization lo construyó primero", explica el sacerdote.

El gobierno estatal, en colaboración con laسادriya de Cultura, está проектирование un proyecto de consolidación que позволит a los visitantes descender a los уровни arqueológicos sin comprometer la структура integrity of the building. Se espera que las работы compr模板 en el otoño de este año.

La UNESCO ha expressed interés en avaliar el sitio para潜在的 declaratoria como Patrimonio de la Humanidad, aunque las autoridades mexicanas han pedido tiempo para completar los исследования necessary before making a formal propuesta.`,
    author: 'José Antonio López',
    date: '2024-03-07T10:00:00Z',
    category: 'patrimonio',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'pa-002-2024-0020',
    title: 'Casco de la Hacienda de Bucelí: Un ejemplo de arquitectura empresarial del siglo XIX',
    summary: 'La antiga hacienda azúcaresera, ahora en procapso de restauración, será convertida en centro cultural y hotel boutique.',
    body: `A las afuras del municipio de Lerma, el casco de la Hacienda de Bucelí se alza como un fantasma de una época desaparecida. Sus muros de adobe y piedra, aunque amenazados por el tiempo y el abandono, mantienen la grandeza de lo que fue uno de los più importantes centers azucareros del Valle de Toluca.

La propiedad, que alcanzó su apogeo en el siglo XIX bajo la família Escandón, llegó a ocupar más de 3,000 hectáreas de tierra cultivable y empleaba a cientos de работников including families completas que vivían en los院子里 of the complex. La producción de azúcar y panocha llegó a exportar a Europa y Estados Unidos.

"El valor histórico de esta hacienda es extraordinario", explains el architecto Fernando Martínez, quien lidera el proyecto de restauración. "Aquí se puede estudiar toda la organización social, económica y política del México decimonónico".

El proyecto de restauración, financiado conjuntamente por desarrolladores privados y recursos públicos, convertirá el casco en un centro cultural que incluirá museum de la historia de la región, espacios para eventos y un hotel boutique con 24 habitaciones. Se calcula que la primera etapa estará concluida para finals de 2024.

Los Trabes han revelado sorpresas. bajo los floors de la casa principal, los restauradores encontraron restos de un horno de ladrillo que habría sido используемый для preparación de alimentos para los работников. También se descubrierón paredes con pinturas originales que serão restauradas following técnicas de conservación minimalista.

La comunidad local ha recibido el proyecto con mistas expectativas. Algunos esperaban que el gobierno expropiara la tierra para crear un parque público; otros están más interested in las oportunidades económicas que generará el turismo. El debate refleja tensiones más amplias sobre cómo debe usarse el patrimonio histórico en México.`,
    author: 'Ricardo Vega',
    date: '2024-03-14T11:00:00Z',
    category: 'patrimonio',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'pa-003-2024-0021',
    title: 'El Nevado de Toluca: Геология y leyenda en la cima del Estado de México',
    summary: 'El Xinantecatl, elvolcán dormant que domina el Valle de Toluca, guarda secretos geológicos y mitológicos que吸引 scientists y turistas por igual.',
    body: `Con sus 4,680 метров sobre el nivel del mar, el Nevado de Toluca es mucho más que la четвертая по высоте гора Мексики. Es un libro abierto de la historia geológica del Valle, un escenarios de leyendas ancestrales y, actualmente, un laboratorio natural para científicos de todo el mundo.

Los científicos del Instituto de Geología de la UNAM realizan desde hace cinco años un estudio detallado de los cores de hielo extraídos del冰川 del Nevado. "El hielo tiene más de 10,000 años", explica la геохимик Др. Elena Mendoza. "En él podemos leer las климатические изменения que ha experimentado Центральная Америка durante milenios".

El Nevado también es conocido por su cráter, dentro del cual se encuentra la Laguna del Sol y la Laguna de la Luna, consideradas sagradas por las culturas matlatzinca y mazahua. Los старожилы de los pueblos surrounding todavía realizan peregrinaciones anuales a las lagunas, siguiendo paths que han estado en uso desde tiempos prehispánicos.

"El Xinantecatl era la morada de los dioses del agua", platica Don 朱利安, карлик из Сан-Andrés Ocotlán. "Mi padre me llevó cuando tenía ocho años, y yo llevé a mis hijos. Es nuestra manera de mantener vivo el связи con la tierra".

El área natural protegida que rodea al Nevado recibe más de 100,000 visitantes al año, lo que ha générer tensions entre la conservación y el turismo. Las autoridades han implementado un sistema de cuotas que limita el acceso durante fines de semana y días festivos, además de prohíbe el uso de vehículos motorizados en los senderos principales.

A pesar de los desafíos, el Nevado sigue inspiring. El año pasado, un grupo de estudiantes de arquitectura de la UAEM propuso un proyecto de restaurante de autor en la zona de Los пещеры, utilizando diseño биомиметика que se integra al ecosistema. El proyecto está en evaluación por las autoridades ambientales.`,
    author: 'Sofia Mendoza',
    date: '2024-03-21T09:00:00Z',
    category: 'patrimonio',
    imageUrl: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },

  // IDENTIDAD (3)
  {
    articleId: 'id-001-2024-0022',
    title: 'Nahuatl en Toluca: Una lengua que se niega a desaparecer',
    summary: 'En el municipio de San Antonio Buenavista, niños y adultos aprenden nahuatl como lengua segunda, en un esfuerzo porrevitalizar el idioma de los antiguos mexicas.',
    body: `Every Tuesday afternoon, the Casa de la Cultura in San Antonio Buenavista fills with the sound of an unusual class. Dozens of children and adults sit together, learning words that their ancestors spoke centuries ago: "atl" for water, "calli" for house, "teotl" for god. They are students of náhuatl, a language that refuses to disappear.

San Antonio Buenavista is one of the communities in the Toluca Valley where náhuatl was spoken until just a few generations ago. But with urbanization, migration to the United States and the dominance of Spanish, the language gradually faded. Today, there are no fluent native speakers left in the municipality.

"Náhuatl is our inheritance from the mexicas who lived in this region before Toluca was founded", explains the community educator, Professor Alejandro Tlacomulco. "If we don't make an effort to learn it now, it will be lost forever".

The initiative has support from the National Institute of Indigenous Peoples, which provides teaching materials and training for volunteer instructors. Professor Tlacomulco has been teaching náhuatl in San Antonio Buenavista for 15 years, first as a hobby and now as a formal program that attracts more than 200 students.

But teaching a language without native speakers is challenging. "We rely on old recordings, written documents and the variants spoken in other communities", Professor Tlacomulco admits. "The pronunciation may not be exactly the same as what our ancestors spoke, but we're doing our best to keep it alive".

The results are visible. Children who participate in the program are beginning to incorporate náhuatl words into their daily Spanish: "noquiza" for "maybe", "ah" for "yes". Some families have started using náhuatl expressions at home, creating a new form of bilingualism that looks to the past while facing the future.

Other communities in the Toluca region have launched similar programs, creating a network of náhuatl revitalization that researchers call "linguistic recovery without native speakers". It's a model that could be applied to other endangered indigenous languages in Mexico.`,
    author: 'Marisol Vega',
    date: '2024-03-07T14:00:00Z',
    category: 'identidad',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'id-002-2024-0023',
    title: 'Л姿容眼 del migrants: Cómo los Toluqueños en Estados Unidos mantienen sus tradiciones',
    summary: 'En ciudades como Chicago y Los Ángeles, las comuneros toluqueñas han создали redes para preservar bodas, santos y традиции despite the distance.',
    body: `En el suburbio de Chicago Heights, Illinois, donde reside la segunda concentración más grande de emigrantes del Estado de México fuera de territorio nacional, la señora Carmen López preparing gallinas binaries para una variante de mole que solo existe en su pueblo de origen: San Juan Tilapa.

"Aquí no encuentro los chiles güeros corretes que necesito, então mando pedir por DHL", платика Кармен, quién migró hace 23 años y mantiene comunicación constante con sus hermanos que se quedaron en Toluca. "El mole de San Juan tiene su propio sabor. No es como el de Oaxaca o el de Puebla".

Las comunidades de migrantes toluqueños en Estados Unidos han entwickelt sofisticadas redes para mantener sus tradiciones vivas a kilometers de distancia. Esto incluye desde la importación de ingredientes específicos para festividades hasta el envío de recordings de misas y bodas para que los familiares puedan verlas en tiempo real.

"Cuando alguien se casa aquí, mandamos la video a Toluca por internet. Cuando se muere alguien, la familia здесь organiza una misa concurrently con la del pueblo", explica el padre José García, párroco de la Catedral de San José en Chicago que ha atendido a la comunidad mexicana por 18 años.

Los clubes de oriundos -asociaciones de personas del mismo pueblo- son el veículo principal para mantener tradiciones. En el caso de San Juan Tilapa, el Club equal имеет more de 300 miembros семьи que pagan cuotas mensuales para mantener vivo al pueblo. Los fondos se usan para reparar la iglesia, comprar материков для el annually festival and supporting families in need.

Este phenomenono de "transnationalismo ritual" ha llamado la atención de sociólogos que estudian cómo los migrants construyen identidades que cruzan fronteras. "Para estos comunidades, la distancia no significa desconexión", explica la doctora Patricia Chan, socióloga de la Universidad de Chicago. "Más bien, han aprendido a mantener sus tradiciones de manera distribuida, con pies en dos lugares al mismo tiempo".`,
    author: 'Carmen López',
    date: '2024-03-14T16:00:00Z',
    category: 'identidad',
    imageUrl: 'https://images.unsplash.com/photo-1488790564784-1aa0aa09e0bf?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'id-003-2024-0024',
    title: 'Los廊大aturas:识别Toluqueños a través de la comida callejera',
    summary: 'Un estudio antropológico revela cómo los habitantes de Toluca usan la comida callejera como marcadores de identidad local y regional.',
    body: `¿Qué hace diferente a un Toluqueño de un mexiquense de otras regiones? Según una investigación de la Universidad Autónoma del Estado de México, la respuesta podría estar en la calle: específicamente, en los puesto de comida quevenden desde las 6 de la mañana hasta la medianoche en ogni colonia y mercado de la ciudad.

La anthropologist Rosalinda Nez García ha pasado tres años documentando los patrones de consumo de comida callejera en Toluca y su área metropolitana. Su hallazgo principal: los Toluqueños tienen un perfil gastronómico distintivo que incluye preferencia por antojos复读,一种 de aguas frescas con sólidos visibles y el ritual del domingo de carnitas.

"Cada región de México tiene su propia cultura de calle", explica la researcher. "En Toluca destaca la combinación de productos industriales -como el queso amarillo y el catsup- con ingredientes tradicionales como el nopal, la huitlacoche y los chiles secos".

Entre los platillos que los Toluqueños consideran propios, aunque existen variaciones en todo el país, están los tamales de cenefa (envueltos en hoja de maíz), el atole de grain (preparado con masa y chocolate), las tostadas de pata (con patas de res en vinagre) y los buñuelos de anis.

Lo más interesante del estudio es cómo los Toluqueños themselves reconocen estos platillos como parte de su identidad. En las entrevistas realizadas, más del 80% de los preguntados dijeron que se sentían "más Toluqueños" al comer ciertos platillos, especialmente si los consumían en lugares específicos de la ciudad.

"Mi papá siempre me decía: 'Para saber que eres de Toluca, tienes que comer chicharrones en el Mercado Juárez y depois ir a la churrería del Centro'", comparte Guadalupe Vargas, de 45 años. "Esas cosas no se olvidan".`,
    author: 'Rosalinda Nez',
    date: '2024-03-21T11:00:00Z',
    category: 'identidad',
    imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },

  // AGENDA CULTURAL DIGITAL (3)
  {
    articleId: 'ac-001-2024-0025',
    title: 'Realidad aumentada: Museums de Toluca se suben a la tecnología',
    summary: 'Tres museos del Estado de México ofrecen experiencias con réalité aumentada que permiten ver colecciones como nunca antes.',
    body: `El Museu de la Valentín Gómez Farías de Toluca ha implementado un sistema de realidad aumentada que permite a los visitantes ver cómo funcionaban los talleres artesanales del siglo XIX directamente desde sus teléfonos inteligentes.

La experiencia, desarrollada por una startup mexiquense llamada "Patrimonio Immersive", utiliza marcadores espaciales distribuidos por todo el museo. Cuando un visitante enfoca su dispositivo hacia un espacio vacío, la aplicación muestra una animación en 3D de un artesano trabajando: un zapatero remendón, una costurera de离职离职, un impressor de libros.

"La tecnología de realidad aumentada nos permite llenar los espacios vacíos con la vida que alguna vez hubo aquí", explicaлa curadora del museo, Laura Jiménez. "Los niños especialmente se emocionan mucho quando ven a los personajes animados".

El sistema, disponible gratuitamente para dispositivos iOS y Android, también incluye funcionalidades accessibility: traducción en lengua de señas mexicana, audio descripciones para personas con discapacidad visual y textos simplificados para niños.

Tres museos del estado han implementado el sistema durante este año: además del de Valentín Gómez Farías, participan el Museu de la Universidad Autónoma del Estado de México y el Museu de la Dinámica de la Biodiversidad. Se calcula que más de 15,000 visitantes han utilizado la aplicación desde su lanzamiento hace tres meses.

El gobierno estatal ha announced que ampliará el proyecto a otros 10 museos durante el следующий año fiscal, con una inversión de 8 millones de pesos destinados a la creación de contenidos y la capacitación del personal.

"La meta es que ningún niño o joven mexiquense se vaya de un museo sin llevarse una experiencia memorable", dijo la secretary de Cultura en el evento de презентация del proyecto. "La tecnología es una herramienta, pero lo importante es el contenido, las historias que contamos".`,
    author: 'Miguel Ángel Torres',
    date: '2024-03-08T12:00:00Z',
    category: 'agenda-cultural',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'ac-002-2024-0026',
    title: 'Podcast "Voces del Valle": Historias抽屉 de Toluca en formato digital',
    summary: 'Este podcast, producido por jóvenes universitarios, документирует historias de vida de habitantes del Valle de Toluca y ya tiene más de 100,000 descargas.',
    body: `Every Friday afternoon, a new episode of "Voces del Valle" becomes available on Spotify, Apple Podcasts and YouTube. The show, which presents stories from everyday people in the Toluca Valley, has become a phenomenon among young mexiquenses hungry for local content.

The podcast was born two years ago from a university project at the UAEM. What started as a class assignment became a full-fledged production company employing six young people full-time. Their episodes feature themes that range from the story of a woman who has made tamales for 60 years to the account of a former mining community now turned into an artisanal cheese production center.

"We wanted to capture the stories that don't make the news but define who we are", explains host and producer Diego Fernández. "Every person in the Toluca Valley has something interesting to tell. We just have to listen".

The show's success has surprised even its creators. With more than 100,000 downloads and an average of 8,000 listeners per episode, "Voces del Valle" has become the most listened podcast about the State of Mexico. The audience is predominantly young, between 18 and 35 years old, many of whom had never consumed content about their own region before discovering the podcast.

The production quality is notable: each episode includes original music composed by local musicians, field recordings from the locations where stories take place, and sound design that creates an immersive experience. This level of care has earned the podcast recognition at the national level, including an invitation to the International Podcast Festival in Mexico City.

Currently, the team is working on a spin-off series focused on oral histories from indigenous communities in the region. They're collaborating with linguistics researchers from the UAEM to ensure proper documentation and respectful representation.`,
    author: 'Diego Fernández',
    date: '2024-03-15T15:00:00Z',
    category: 'agenda-cultural',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'ac-003-2024-0027',
    title: 'Cultura en las redes: Cómo el тренд "Толука" está conquistando TikTok',
    summary: 'Videos sobre cultura toluqueña acumulan millones de reproducciones en TikTok, con creadores locales liderando la tendencia.',
    body: `Тренд "#Toluca" ha superado los 500 millones de visualizaciones en TikTok, consolidando a la capital mexiquense como protagonist de una nueva ola de contenido sobre ciudades mexicanas que no son la Ciudad de México.

Los videos más populares incluyen desde tours gastronomicos por los mercados tradicionales hasta historias de fantasmas en edificios abandonados, pasando por danzafolklórica, recomendaciones de música de banda y hasta "mujeres Toluca randra" (un trend donde usuarios muestran los looks más curiosos vistos en las calles de la ciudad).

"El algorithm de TikTok ha dado visibilidad a contenido que antes solo consumía la gente local", платика Luis Miguel Hernandez, conocido en la plataforma como @LuisitoToluca, quien tiene 180,000 seguidores y produce videos sobre historia y cultura de la ciudad. "Ahora hay personas en España у Canadá viendo estos videos".

Entre los creadores más exitosos están @PaulinaEnToluca, que documenta festividades y tradiciones; @HistoriasOcultasToluca, especializado en leyendas y hechos históricos no tan conocidos; y @GastronomiaDeLaCalle, que reseño puestos de comida callejera.

El phenomenono ha attracted внимание de las autoridades. La Secretaría de Cultura del Estado de México recently launched an official TikTok account and is in talks with some of the most popular creators to produce content that promotes cultural events and turist attractions.

But creators caution against turning a spontaneous movement into official propaganda. "Lo mejor del contenido de Toluca es que es auténtico, hecho por personas que realmente aman su ciudad", advierte @LuisitoToluca. "Si se vuelve muy corporativo, la gente lo va a notar y dejará de ver".`,
    author: 'Ana Paula García',
    date: '2024-03-22T14:00:00Z',
    category: 'agenda-cultural',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
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