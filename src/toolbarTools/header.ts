export const getInfoFocusNode = (_node?: Node) => {
  let focusNode: Node | null = null;
  if (_node) {
      focusNode = _node
  } else {
      let s = window.getSelection()
      if (s && s.focusNode) {
        focusNode = s.focusNode;
      }
  }
  let type = 'text'
  let level = 0
  let place = ''
  let mode = ''
  let provider = ''
  let focusElem = focusNode ? ((focusNode.nodeType === 1 ? focusNode : focusNode.parentElement) as HTMLElement) : null
  if (focusElem) {
      let tagName = focusElem.tagName
      let isHeading = headingTags.includes(tagName)
      let isList = listTags.includes(focusElem.tagName)
      let isImage = focusElem.closest('figure')
      let isEmbed = focusElem.closest('.embed')
      let isSeparator = focusElem.closest('.separator')

      if (!isList) {
          let elem = focusElem.closest(listTags.join(', '))
          if (elem) {
              isList = listTags.includes(elem.tagName)
          }
      }
      if (!isList && !isHeading) {
          let elem = focusElem.closest(headingTags.join(', '))
          if (elem) {
              tagName = elem.tagName
              isHeading = headingTags.includes(tagName)
          }
      }
      if (isHeading) {
          let haveLevel = tagName.length === 2 && tagName[0] === 'H'
          if (haveLevel) {
              level = +tagName[1]
          }
      } else if (isList) {
          type = 'list'
      } else if (isSeparator) {
          mode = Array.from(focusElem.classList)
              .find(el => el.indexOf('mode-') === 0)

          if (mode)
              mode = mode.replace('mode-', '')

          type = 'separator'
      } else if (isImage) {
          type = 'image'
          let classList = Array.from(focusElem.classList)
          place = classList.find(el => el.indexOf('place-') === 0)
          if (place) {
              place = place.replace('place-', '')
          }
      } else if (isEmbed) {
          type = 'embed'
      }
  }
  return { level, type, place, mode, provider, focusElem }
}

export default function header(context: any, config: any) {
  let value = config.header;
  let {focusElem, level} = getInfoFocusNode()
  let preElem = focusElem.closest('pre') || focusElem.querySelector('pre')
  let doubleClick = level === +value[1] || preElem
  if (doubleClick) {
      value = 'P'
  }
  if (preElem) {
      let s = window.getSelection()
      let r = s.getRangeAt(0)
      r.selectNode(preElem)
  }
  document.execCommand('formatblock', false, value);
}