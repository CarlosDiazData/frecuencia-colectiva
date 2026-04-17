import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'Articles';

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
  {
    articleId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Revolutionary AI System Achieves Human-Level Reasoning in Scientific Research',
    summary: 'A breakthrough in artificial intelligence has led to the development of a system capable of independent scientific discovery, marking a significant milestone in machine learning research.',
    body: `In a groundbreaking announcement that has sent ripples through the scientific community, researchers at a leading AI laboratory have unveiled a new artificial intelligence system capable of conducting independent scientific research at an unprecedented level of sophistication.

The system, dubbed "Prometheus," represents a fundamental leap forward in machine learning capabilities. Unlike previous AI models that could only analyze existing data, Prometheus can formulate hypotheses, design experiments, and draw novel conclusions from its findings.

"We're witnessing a transformation in how science can be conducted," said Dr. Sarah Chen, the project's lead researcher. "This system doesn't just process information—it genuinely understands the underlying principles of scientific inquiry."

The implications for various fields are profound. In drug discovery, the AI has already identified three potential treatments for rare diseases that human researchers had overlooked. In materials science, it has predicted novel compounds with properties that could revolutionize energy storage.

However, the breakthrough has also sparked important discussions about the future role of human scientists. While most experts agree that AI will become an invaluable tool in research, there are concerns about dependence on algorithmic decision-making in scientific processes.

The research team has emphasized that Prometheus is designed to augment, not replace, human researchers. "Our goal is to give scientists a powerful assistant that can handle the heavy lifting of data analysis while leaving the creative and ethical decisions to humans," Dr. Chen explained.

Regulatory bodies are now grappling with how to integrate such systems into existing frameworks for scientific research and validation. The FDA and equivalent international agencies have begun consultations with the research team to develop guidelines for AI-assisted discoveries.`,
    author: 'Michael Torres',
    date: '2024-03-15T09:00:00Z',
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
    readTimeMinutes: 6,
  },
  {
    articleId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    title: 'Global Climate Summit Reaches Historic Agreement on Carbon Emissions',
    summary: 'World leaders have signed a landmark accord committing to aggressive carbon reduction targets, marking the most significant international climate action in decades.',
    body: `In what environmental advocates are calling a watershed moment for climate policy, representatives from 195 nations have unanimously agreed to the Geneva Climate Accord, setting legally binding targets for carbon emissions reduction that exceed all previous international commitments.

The agreement, reached after two weeks of intense negotiations at the United Nations Climate Summit, commits developed nations to achieve net-zero emissions by 2040—a full decade earlier than previous targets. Developing nations have agreed to peak emissions by 2035, with substantial financial support from wealthier countries to facilitate the transition.

"This is the moment future generations will point to as the turning point," said UN Secretary-General Maria Santos. "For the first time, we have true global consensus on the urgency and scope of climate action."

The accord includes unprecedented mechanisms for enforcement. A new international body will have the authority to impose trade penalties on nations that fail to meet their targets. Additionally, a $500 billion annual climate fund will support renewable energy infrastructure in developing nations.

Reaction from the business community has been mixed. Renewable energy companies have seen their stock prices surge on news of the agreement, while traditional energy sectors face pressure to accelerate their transition timelines. Major oil companies have issued statements acknowledging the need to adapt their business models.

Scientists have welcomed the agreement but caution that implementation will be crucial. "The targets are ambitious, but achievable if we act now," said climatologist Dr. James Morrison. "The real test will be whether nations follow through on their commitments."

Consumer advocacy groups have emphasized the importance of individual action alongside government policy. "Strong institutions matter, but so does every choice we make in our daily lives," noted environmental activist Elena Rodriguez.`,
    author: 'Jennifer Walsh',
    date: '2024-03-14T14:30:00Z',
    category: 'world',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f31?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    title: 'Historic Championship Victory: Underdogs Crowned World Champions in Stunning Upset',
    summary: 'In one of the most dramatic finals in tournament history, the unseeded underdogs defeated the defending champions in a nail-biting championship match that captivated millions worldwide.',
    body: `They came from nowhere. They defied every prediction. And in the end, they wrote one of the greatest chapters in sporting history.

In a championship final that will be remembered for generations, the team that entered the tournament as 15th seeds clinched the world title with a breathtaking 3-2 victory over the five-time defending champions. The match, played before a sold-out crowd of 80,000, saw momentum swing dramatically throughout, with the underdogs showing remarkable resilience in the decisive fifth set.

"It feels like a dream," said team captain Marcus Williams, tears streaming down his face as he lifted the trophy. "Nobody believed in us. We didn't even believe in ourselves at the start. But we fought for every point, and we made history."

The road to the championship was paved with upsets. Along the way, the underdogs eliminated three top-five ranked teams, each victory more improbable than the last. Critics who dismissed their early success as flukes were forced to reconsider as the team continued to defy expectations.

The final itself was a masterclass in determination. Trailing 0-2 in sets, many expected the champions to cruise to another title. But the underdogs refused to surrender. They clawed their way back, winning the third set in a tiebreaker that some are calling the most thrilling in tournament history.

"We knew we had nothing to lose," Williams explained. "They had everything to lose, and that pressure showed. We played free, we played together, and we played for each other."

The victory has sparked celebrations across the nation, with the team's journey from relative obscurity to world champions being hailed as the ultimate underdog story. City officials have announced plans for a ticker-tape parade through downtown.`,
    author: 'David Kim',
    date: '2024-03-13T22:00:00Z',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934- voices-from-the-field?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    title: 'Museum Exhibition Explores the Intersection of Traditional Art and Digital Innovation',
    summary: 'A groundbreaking new exhibition at the Metropolitan Art Institute challenges conventional boundaries between classical techniques and modern technology, offering visitors a glimpse into the future of artistic expression.',
    body: `What happens when centuries-old artistic traditions meet cutting-edge technology? A remarkable new exhibition at the Metropolitan Art Institute offers a compelling answer, blending classical masterpieces with immersive digital installations in a showcase that critics are calling "revolutionary."

The exhibition, titled "Eternal Echoes," features over 200 works spanning from the Renaissance to the present day, each paired with a contemporary digital companion piece. Visitors move through galleries where a 15th-century portrait seems to come alive through augmented reality, and ancient calligraphy transforms into an interactive light installation.

"Art has always evolved with technology," explains curator Dr. Amelia Sterling. "From the invention of oil paint to the camera, each technological leap has expanded what artists can express. We're simply documenting the latest chapter in that ongoing story."

The centerpiece of the exhibition is a collaborative piece created by artificial intelligence trained on thousands of masterworks. The AI was given no specific instructions, only asked to interpret themes from the exhibition's classical collection. The result is a hauntingly beautiful tapestry that seems to bridge centuries.

Not everyone is convinced. Traditional art purists have expressed concern about the role of technology in artistic creation. "There's something irreplaceable about human touch," argues art historian Professor Robert Chen. "When machines start making aesthetic decisions, are we witnessing art or simulation?"

Nevertheless, the exhibition has drawn record crowds, with tickets selling out weeks in advance. Young visitors especially have responded enthusiastically to the interactive elements, many experiencing classical art for the first time through the digital lens.

The exhibition runs through June and will travel to major cities across four continents, bringing its unique blend of old and new to a global audience.`,
    author: 'Sophie Laurent',
    date: '2024-03-12T11:00:00Z',
    category: 'culture',
    imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    title: 'Quantum Computing Breakthrough Promises to Transform Drug Discovery',
    summary: 'Scientists have achieved a major milestone in quantum computing that could accelerate pharmaceutical development, potentially bringing life-saving treatments to patients years ahead of schedule.',
    body: `The pharmaceutical industry stands on the brink of a revolution. A team of researchers has demonstrated a quantum computing system capable of simulating molecular interactions with unprecedented accuracy, a breakthrough that could dramatically shorten the drug development timeline.

For decades, the process of discovering and developing new medications has been painstakingly slow. Traditional methods require researchers to test thousands of compounds, a process that can take over a decade and cost billions of dollars. The new quantum system can model these interactions in hours rather than years.

"We've essentially given researchers a time machine," said Dr. Robert Zhang, lead scientist on the project. "Instead of testing blindly, they can now see exactly how a drug will interact with its target at the atomic level before synthesizing a single compound."

The technology has already yielded promising results. In collaboration with a major pharmaceutical company, researchers used the system to identify a potential treatment for a rare neurological disorder that had resisted conventional approaches. Early trials show significant promise.

The implications extend beyond drug discovery. The same modeling capabilities could accelerate development of new materials, improve understanding of complex chemical processes, and help address challenges in renewable energy storage.

"This is a paradigm shift," said pharmaceutical analyst Maria Santos. "Companies that move quickly to adopt this technology could see their development pipelines transform completely."

However, significant challenges remain. Current quantum computers require extremely cold operating temperatures and are prone to errors. Scaling the technology for widespread pharmaceutical use will require continued innovation in both hardware and software.

Despite these hurdles, the research team is optimistic about the timeline for practical applications. "We're not talking about decades," Dr. Zhang said. "We're talking about years."`,
    author: 'Dr. Amanda Foster',
    date: '2024-03-11T08:30:00Z',
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
  },
  {
    articleId: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
    title: 'Space Agency Announces Ambitious Plan for Permanent Lunar Research Station',
    summary: 'International space agencies have unveiled plans for a permanent human presence on the Moon, with construction of the first lunar research facility scheduled to begin within the decade.',
    body: `Humanity is returning to the Moon—this time to stay. An international coalition of space agencies has announced a joint venture to establish a permanent research station on the lunar surface, marking the most ambitious space exploration project since the Apollo missions.

The Lunar Gateway Research Facility, planned for deployment in the mid-2030s, will serve as a permanent outpost for scientific research, technology testing, and preparation for eventual missions to Mars. Unlike the temporary bases of science fiction, this facility is designed for continuous habitation by rotating teams of scientists and engineers.

"The Moon isn't just a destination anymore," said ESA Director General Pierre Moreau. "It's becoming a second home for humanity—a place where we can learn to live and work in space while conducting research that benefits everyone on Earth."

The station will be built using advanced 3D printing technology, with robots constructing the initial habitat modules before the first crew arrives. Materials will be sourced, where possible, from lunar regolith, reducing the need to transport supplies from Earth.

Scientific priorities for the facility include studying the Moon's geology and resource potential, conducting experiments in the lunar environment, and testing life support systems for long-duration space missions. Perhaps most significantly, the station will serve as a launching point for deeper space exploration.

The project represents a new model for international space cooperation, with 23 countries contributing expertise and resources. The United States, European Space Agency, China, Japan, and India are among the founding partners, though the coalition has emphasized openness to additional participants.

Critics have questioned the cost of such an endeavor, especially given pressing needs on Earth. Supporters counter that the technology developed for the station has practical applications, from medical devices to environmental monitoring.

"We're doing this not despite the challenges we face on Earth, but because of them," said NASA Administrator Dr. Linda Chen. "The innovations that help us explore space will also help us protect our home planet."`,
    author: 'Christopher Hayes',
    date: '2024-03-10T16:00:00Z',
    category: 'world',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=800&fit=crop',
    readTimeMinutes: 6,
  },
  {
    articleId: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
    title: 'Olympic Committee Unveils Revolutionary Format for Future Games',
    summary: 'The International Olympic Committee has announced sweeping changes to the Olympic format, introducing new sports and innovative competition structures aimed at engaging younger audiences worldwide.',
    body: `The Olympics are changing. The International Olympic Committee has approved its most comprehensive reform package in decades, introducing new sports, modifying competition formats, and embracing digital innovation in what officials describe as "the modernization of the Games for a new era."

Among the headline changes is the addition of esports as an official Olympic category. After years of debate, competitive gaming will make its full Olympic debut in the 2028 Los Angeles Games, with titles selected for their accessibility and global appeal.

"We're not replacing traditional sports," insisted IOC President Marc Dupont. "We're adding new ways to compete that resonate with young people who might not connect with conventional athletics. The Olympic spirit remains the same—excellence, friendship, and respect."

Other innovations include a "challenge" system that allows athletes to request video reviews of referee decisions, and a new mixed-gender format for several team events. Traditional sports like gymnastics and track will see modifications to their scoring systems aimed at increasing transparency.

The reforms have generated considerable debate. Purists worry that adding esports dilutes the Olympic brand, while others question whether digital competitions can capture the same spirit as athletic achievement.

"Physical competition has always been at the heart of the Olympics," said former Olympic champion Maria Gonzalez. "There's something about watching human bodies pushed to their limits that transcends language and culture. Can a video game match that?"

Supporters counter that the Olympics must evolve to remain relevant. Youth viewership of traditional sports has declined steadily over the past two decades, and the IOC's research suggests that esports could attract millions of new fans to the Olympic movement.

The changes will be implemented gradually, with the 2026 Winter Games serving as a transition period. The full reform package will be in place for the 2028 Summer Games.`,
    author: 'Emma Richardson',
    date: '2024-03-09T12:00:00Z',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=1200&h=800&fit=crop',
    readTimeMinutes: 4,
  },
  {
    articleId: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
    title: "Award-Winning Director's New Film Explores Memory and Identity Through Dance",
    summary: 'The latest masterpiece from acclaimed filmmaker releases this weekend, blending documentary realism with choreographed sequences to create what critics are calling a transformative cinematic experience.',
    body: `Cinema meets choreography in what may be the most ambitious film of the year. Director Elena Vance's latest work, "Echoes of Tomorrow," defies easy categorization—a documentary that becomes a dance film, a meditation on memory that unfolds as a fever dream.

The film follows three individuals navigating the aftermath of memory loss, interweaving their real stories with elaborate dance sequences that visualize the memories they're trying to reclaim. The result is a work that critics are struggling to describe, though "breathtaking" appears in nearly every review.

"Elena has created something genuinely new," said film critic James Morrison. "I've been writing about cinema for thirty years, and I've never seen anything quite like this. It's as if she's found a way to photograph thought itself."

Vance spent two years developing the project, working closely with neuroscientists to ensure the film's representation of memory was accurate while allowing the choreographed sequences to interpret those processes artistically.

The dancers, drawn from companies across four continents, underwent extensive preparation. Many learned specialized techniques for expressing specific types of memory loss through movement—a process that took months to master.

"I wanted audiences to feel what memory loss is like, not just understand it intellectually," Vance explained. "Dance communicates on a level that bypasses language entirely. When a dancer struggles to complete a familiar movement, the audience feels that struggle in their own body."

The film's soundtrack, composed by award-winning musician Thomas Berg, combines orchestral elements with electronic soundscapes and recordings of actual therapy sessions.

Premiere screenings have sparked standing ovations and spirited debates about the future of cinematic art. Some viewers have been moved to tears; others have expressed discomfort with the film's challenging formal experiments. Few remain neutral.

"Echoes of Tomorrow" opens in theaters worldwide this weekend, with a special extended version planned for streaming platforms next month.`,
    author: 'Nathan Price',
    date: '2024-03-08T19:00:00Z',
    category: 'culture',
    imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200&h=800&fit=crop',
    readTimeMinutes: 5,
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
  console.log(`Seeded ${sampleArticles.length} articles across categories: technology, world, sports, culture`);
}

seedDatabase().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
