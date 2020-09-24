import CreatorContext from "~/interfaces/CreatorContext";

export default function hr(context: CreatorContext, config: any) {
  const elem = document.createElement('DIV');
  elem.contentEditable = "false";
  const hr = document.createElement('HR');
  elem.appendChild(hr);
  console.log(context);
  context.focusElement.replaceWith(elem);
}