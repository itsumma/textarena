import CreatorOptions from 'interfaces/CreatorOptions';
import hr from './hr';
import image from './image';

const creators: {[key: string]: CreatorOptions} = {
  hr: {
    name: 'hr',
    title: 'Add text separator',
    icon: '<b>—</b>',
    controlKey: 'h',
    processor: hr,
  },
  img: {
    name: 'image',
    title: 'Add image',
    icon: '🌄',
    controlKey: 'g',
    processor: image,
  },
};

export default creators;
