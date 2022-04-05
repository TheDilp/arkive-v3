// import { ActionKind, AutocompleteAction } from "prosemirror-autocomplete";
// export function reducer(
//   action: AutocompleteAction,
//   setActiveIndex: (activeIndex: null | number) => void
// ): boolean | "KEEP_OPEN" {
//   const { kind, view, filter, range } = action;

//   switch (action.kind) {
//     case ActionKind.open:
//       //   handleSearch(action.search);
//       //   placeSuggestion(true);
//       return true;
//     case ActionKind.up:
//       setActiveIndex((activeIndex: null | number) => {
//         if (activeIndex === null || activeIndex === 0) {
//           return items.length - 1;
//         } else if (activeIndex <= items.length - 1) {
//           return activeIndex - 1;
//         } else {
//           return 0;
//         }
//       });
//       return true;
//     case ActionKind.down:
//       selectSuggestion(+1);
//       return true;
//     case ActionKind.filter:
//       filterSuggestions(action.filter);
//       return true;
//     case ActionKind.enter:
//       // This is on Enter or Tab
//       const { from, to } = action.range;
//       const tr = action.view.state.tr
//         .deleteRange(from, to) // This is the full selection
//         .insertText("You can define this!"); // This can be a node view, or something else!
//       action.view.dispatch(tr);
//       return true;
//       // To keep the suggestion open after selecting:
//       return KEEP_OPEN;
//     case ActionKind.close:
//       // Hit Escape or Click outside of the suggestion
//       closeSuggestion();
//       return true;
//     default:
//       return false;
//   }
// }
export function test() {}
