// // String Literal (type and value) for proper type checking
// const myCustomEventType = 'my-custom-event' as const;

// type MyCustomEventState = 'open' | 'update' | 'close';

// interface MyCustomEventDetail {
//   id: number,
//   name: string,
//   state: MyCustomEventState
// }

// // "CustomEvent" comes from 'lib.dom.d.ts' (tsconfig.json)
// class MyCustomEvent extends CustomEvent<MyCustomEventDetail> {
//   constructor(detail: MyCustomEventDetail) {
//     super(myCustomEventType, { detail });
//   }
// }

// export default MyCustomEvent;

// // augment your global namespace
// // here, we're augmenting 'WindowEventMap' from 'lib.dom.d.ts' 👌
// declare global {
//     interface WindowEventMap {
//         [myCustomEventType]: MyCustomEvent
//     }
// }

document.addEventListener('my-custom-event1aa', () => {
  //
}, false);
