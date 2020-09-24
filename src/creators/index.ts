import CreatorOptions from "~/interfaces/CreatorOptions";
import hr from "./hr";

const creators: {[key: string]: CreatorOptions} = {
  'hr': {
    name: 'hr',
    title: 'Add text separator',
    icon: '<b>—</b>',
    controlKey: 'h',
    processor: hr,
  },
}

export default creators;