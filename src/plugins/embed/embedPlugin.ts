import Textarena from '../../Textarena';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import ArenaSelection from '../../helpers/ArenaSelection';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { ArenaSingleInterface } from '../../interfaces/Arena';
import outputEmbed from './outputEmbed';
import ArenaEmbed from './ArenaEmbed';
import { EmbedPluginOptions } from './types';
import ArenaEmbedSimple from './ArenaEmbedSimple';
import ArenaEmbedForm from './ArenaEmbedForm';
import { createElemEmbed, getEmbedUrl, providerGetter } from './embedUtils';
import services from './embedServices';
import ArenaEmbedIFrame from './ArenaEmbedIFrame';

const defaultOptions: EmbedPluginOptions = {
  name: 'embed',
  title: 'Embed',
  icon: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 511.997 511.997" style="enable-background:new 0 0 511.997 511.997;" xml:space="preserve">
  <g>
    <g>
      <path d="M506.76,242.828l-118.4-125.44c-7.277-7.718-19.424-8.07-27.142-0.787c-7.706,7.277-8.064,19.43-0.781,27.142
        l105.965,112.256L360.437,368.268c-7.283,7.712-6.925,19.859,0.781,27.142c3.712,3.501,8.454,5.235,13.178,5.235
        c5.101,0,10.195-2.022,13.965-6.01l118.4-125.446C513.742,261.785,513.742,250.226,506.76,242.828z" fill="currentColor"/>
    </g>
  </g>
  <g>
    <g>
      <path d="M151.566,368.262L45.608,255.999l105.958-112.262c7.277-7.712,6.925-19.866-0.787-27.142
        c-7.706-7.277-19.866-6.925-27.142,0.787l-118.4,125.44c-6.982,7.398-6.982,18.963,0,26.362L123.643,394.63
        c3.776,4,8.864,6.016,13.965,6.016c4.723,0,9.466-1.741,13.171-5.242C158.498,388.127,158.843,375.974,151.566,368.262z" fill="currentColor"/>
    </g>
  </g>
  <g>
    <g>
      <path d="M287.061,52.697c-10.477-1.587-20.282,5.606-21.882,16.083l-56.32,368.64c-1.6,10.483,5.6,20.282,16.083,21.882
        c0.986,0.147,1.958,0.218,2.925,0.218c9.325,0,17.504-6.803,18.957-16.301l56.32-368.64
        C304.744,64.095,297.544,54.297,287.061,52.697z" fill="currentColor"/>
    </g>
  </svg>`,
  tag: 'ARENA-EMBED',
  attributes: {
    contenteditable: false,
  },
  allowedAttributes: ['embed', 'type', 'url', 'html'],
  shortcut: 'Ctrl + Alt + E',
  command: 'add-embed',
  components: [
    {
      component: 'arena-embed',
      componentConstructor: ArenaEmbed,
    },
    {
      component: 'arena-embed-simple',
      componentConstructor: ArenaEmbedSimple,
    },
    {
      component: 'arena-embed-form',
      componentConstructor: ArenaEmbedForm,
    },
    {
      component: 'arena-embed-iframe',
      componentConstructor: ArenaEmbedIFrame,
    },
  ],
  marks: [
    {
      tag: 'ARENA-EMBED',
      attributes: [],
    },
    {
      tag: 'DIV',
      attributes: ['class="arena-embed"'],
    },
  ],
  output: outputEmbed,
  services,
};

const embedPlugin = (opts?: Partial<EmbedPluginOptions>): ArenaPlugin => ({
  register: (textarena: Textarena) => {
    const {
      name, icon, title, tag, attributes, allowedAttributes,
      shortcut, command, components, marks, output, oEmbedProviders: providers, providerOptions,
    } = { ...defaultOptions, ...(opts || {}) };
    if (components) {
      components.forEach(({ component, componentConstructor }) => {
        if (component && componentConstructor && !customElements.get(component)) {
          customElements.define(component, componentConstructor);
        }
      });
    }
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        single: true,
        output,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaSingleInterface;
    textarena.addSimpleArenas(arena);
    const getEmbedProvider = providers
      ? providerGetter(providers, providerOptions)
      : () => undefined;
    if (command) {
      textarena.registerInsertReplaceCommand(
        command,
        arena,
        { getEmbedProvider },
      );
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (title) {
        textarena.registerCreator({
          name,
          icon,
          title,
          shortcut,
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    }

    const simpleArena = textarena.registerArena(
      {
        name: 'simple-embed',
        tag: 'ARENA-EMBED-SIMPLE',
        attributes: { contenteditable: false },
        allowedAttributes,
        single: true,
      },
      [
        {
          tag: 'ARENA-EMBED-SIMPLE',
          attributes: [],
        },
      ],
      [textarena.getRootArenaName()],
    ) as ArenaSingleInterface;
    textarena.addSimpleArenas(simpleArena);
    textarena.registerMiddleware(
      (
        ta: Textarena,
        sel: ArenaSelection,
        data: string | DataTransfer,
      ) => {
        const text = typeof data === 'string' ? data : data.getData('text/plain');
        if (text && sel.isSameNode() && sel.isCollapsed() && sel.getCursor().node.hasText) {
          // Check for match in OEmbed providers first
          const result = getEmbedProvider(text);

          // if no match were found at provided OEmbed services create embed
          // element with iframe from ./embedServices.ts
          const embedElement = result ? undefined : createElemEmbed(text);
          let node: AnyArenaNode | undefined;
          if (result || embedElement) {
            const { node: textNode } = sel.getCursor();
            const replace = textNode.hasText && textNode.getText().getText().length === 0;
            const [, insertedNode] = ta.insertBeforeSelected(sel, arena, replace);
            node = insertedNode;
          }
          if (result) {
            node?.setAttribute('embed', result.provider_name);
            node?.setAttribute('url', getEmbedUrl(result.endpoint, text, result.opts));
            return [true, sel];
          }
          if (embedElement) {
            node?.setAttribute('embed', embedElement.embed);
            node?.setAttribute('type', embedElement.type);
            node?.setAttribute('html', embedElement.html);
            node?.setAttribute('url', embedElement.url);
            return [true, sel];
          }
        }
        return [false, sel];
      },
      'before',
    );
  },
});

export default embedPlugin;
