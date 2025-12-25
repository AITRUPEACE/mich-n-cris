// src/data/story.js
// Story content and page configuration for "Mish'n'Cris Adventures Volume I: Concrescence"

export const storyPages = [
  {
    id: 'cover',
    type: 'cover',
    text: "Mish'n'Cris Adventures",
    subText: "Volume I: Concrescence",
    background: '/images/cover.png'
  },
  {
    id: 'page-1',
    type: 'story',
    text: "The first snow of winter had finally arrived, and Michelle and Cris knew exactly what to do with it.",
    background: '/images/1.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-2',
    type: 'story',
    text: "We should head home soon, Michelle said, watching the sun dip behind the trees—but neither of them moved.",
    background: '/images/2.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-3',
    type: 'story',
    text: "The forest had grown dark around them, and somewhere in the branches above, two pale blue lights blinked open.",
    background: '/images/3.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: [
      'snow',
      { type: 'glowing-eyes', position: { x: 72, y: 22 }, size: 'small' }
    ]
  },
  {
    id: 'page-4',
    type: 'story',
    text: "Did you see that? Cris whispered, pointing toward the glow that drifted deeper into the woods.",
    background: '/images/4.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: [
      'snow',
      { type: 'glowing-eyes', position: { x: 68, y: 35 }, size: 'small' }
    ]
  },
  {
    id: 'page-5',
    type: 'story',
    text: "They followed the eyes until something else appeared through the snow—warm, golden light.",
    background: '/images/5.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-6',
    type: 'story',
    text: "A cabin sat alone in a clearing, its windows glowing like embers in the frozen dark.",
    background: '/images/6.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-7',
    type: 'multi-frame',
    text: "This place feels... strange, Michelle murmured, though the warmth beckoned them forward.",
    textPosition: 'bottom',
    frames: [
      {
        image: '/images/7-fogged.png',
        interaction: 'fog-wipe'
      },
      {
        image: '/images/7-not-fogged.png',
        interaction: null
      }
    ]
  },
  {
    id: 'page-8',
    type: 'story',
    text: "What is this place? she wondered as they climbed the snow-dusted steps.",
    background: '/images/8.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-9',
    type: 'story',
    text: "The door swung open easily, as if the cabin had been waiting for them.",
    background: '/images/9.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-10',
    type: 'story',
    text: "I'll go get some firewood! Cris announced, already heading back into the cold.",
    background: '/images/10.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-11',
    type: 'story',
    text: "From outside, the cabin glowed like a lantern, and for a moment they both felt something watching over them.",
    background: '/images/11.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-12',
    type: 'multi-frame',
    text: "Soon flames crackled in the hearth, painting the walls in dancing amber light.",
    textPosition: 'bottom',
    frames: [
      {
        image: '/images/12-no-fire.png',
        interaction: 'fireplace'
      },
      {
        image: '/images/12-with-fire.png',
        interaction: null
      }
    ]
  },
  {
    id: 'page-13',
    type: 'story',
    text: "While the kettle sang, Michelle glimpsed something at the window—two points of blue light, hovering in the dark.",
    background: '/images/13.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: [
      { type: 'glowing-eyes', position: { x: 78, y: 32 }, size: 'small' }
    ]
  },
  {
    id: 'page-14',
    type: 'multi-frame',
    text: "I saw those blue eyes out there, Cris said between sips of cocoa, they led us here.",
    textPosition: 'bottom',
    frames: [
      {
        image: '/images/14-1.png',
        interaction: 'tap-element'
      },
      {
        image: '/images/14-2.png',
        interaction: 'tap-element'
      },
      {
        image: '/images/14-3.png',
        interaction: null
      }
    ]
  },
  {
    id: 'page-15',
    type: 'story',
    text: "Standing in the doorway, the cold rushed in, but curiosity pulled them forward.",
    background: '/images/15.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-16',
    type: 'story',
    text: "There, at the edge of the porch light, sat a small tuxedo kitten with eyes like winter stars.",
    background: '/images/16.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: [
      'snow',
      { type: 'glowing-eyes', position: { x: 50, y: 55 }, size: 'medium', color: 'cyan' }
    ]
  },
  {
    id: 'page-17',
    type: 'story',
    text: "The cat turned and padded down a narrow path, glancing back as if to say: follow me.",
    background: '/images/17.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-18',
    type: 'story',
    text: "We have to find it, Michelle said, pulling her scarf tighter against the biting wind.",
    background: '/images/18.png',
    interaction: null,
    textPosition: 'bottom',
    ambientEffects: ['snow']
  },
  {
    id: 'page-19',
    type: 'story',
    text: "Through the trees ahead, colors began to bloom—soft purples and pinks pulsing like a heartbeat.",
    background: '/images/19.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-20',
    type: 'story',
    text: "They stepped into a clearing carpeted with crystal mushrooms, each one glowing from within, and there in the center sat the kitten.",
    background: '/images/20.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-21',
    type: 'story',
    text: "Where are we...?? Michelle breathed, her words turning to mist in the impossible light.",
    background: '/images/21.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-22',
    type: 'story',
    text: "The kitten began to rise, floating gently upward, its eyes bright as twin moons.",
    background: '/images/22.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-23',
    type: 'story',
    text: "And then they were rising too.. lifted by something invisible and vast, the ground falling away beneath them.",
    background: '/images/23.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-24',
    type: 'story',
    text: "They drifted above the clouds, the forest shrinking to a dark patchwork below, while above them the stars grew impossibly close.",
    background: '/images/24.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-25',
    type: 'story',
    text: "Galaxies spiraled past like cosmic pinwheels, nebulae bloomed in colors without names, and the kitten floated between them, perfectly calm.",
    background: '/images/25.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-26',
    type: 'story',
    text: "Space itself seemed to fold and unfold, carrying them through corridors of light toward something infinite.",
    background: '/images/26.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-27',
    type: 'story',
    text: "And in that vastness, they understood: every star, every soul, every moment... all one, all connected, all returning home.",
    background: '/images/27.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-28',
    type: 'story',
    text: "Years later, on an October morning, Michelle and Cris sat on the porch of their cabin with coffee in hand, the cat purring softly between them.",
    background: '/images/28.png',
    interaction: null,
    textPosition: 'bottom'
  },
  {
    id: 'page-29',
    type: 'multi-frame',
    text: "Fin. But not far off, familiar eyes glowed... another adventure awaits.",
    textPosition: 'bottom',
    frames: [
      {
        image: '/images/29-1.png',
        interaction: 'tap-element'
      },
      {
        image: '/images/29-2.png',
        interaction: null
      }
    ],
    ambientEffects: [
      { type: 'glowing-eyes', position: { x: 25, y: 60 }, size: 'small' }
    ]
  }
];

export const storyMeta = {
  title: "Mish'n'Cris Adventures",
  volume: "Volume I",
  subtitle: "Concrescence",
  author: "Unknown",
  totalPages: storyPages.length
};
