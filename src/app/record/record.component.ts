import {Component, ViewEncapsulation} from '@angular/core';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

@Component({
  selector: 'app-record',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {

  value = "";
  keyboard: Keyboard;
  keyboardControlPad: Keyboard;
  keyboardArrows: Keyboard;
  keyboardNumPad: Keyboard;
  keyboardNumPadEnd: Keyboard;


  ngAfterViewInit() {
    this.keyboard = new Keyboard(".simple-keyboard-main", {
      ...this.commonKeyboardOptions,
      /**
       * Layout by:
       * Sterling Butters (https://github.com/SterlingButters)
       */
      layout: {
        default: [
          "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
          "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
          "{tab} q w e r t y u i o p [ ] \\",
          "{capslock} a s d f g h j k l ; ' {enter}",
          "{shiftleft} z x c v b n m , . / {shiftright}",
          "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
        ],
        shift: [
          "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
          "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
          "{tab} Q W E R T Y U I O P { } |",
          '{capslock} A S D F G H J K L : " {enter}',
          "{shiftleft} Z X C V B N M < > ? {shiftright}",
          "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
        ]
      },
      display: {
        "{escape}": "esc ⎋",
        "{tab}": "tab ⇥",
        "{backspace}": "backspace ⌫",
        "{enter}": "enter ↵",
        "{capslock}": "caps lock ⇪",
        "{shiftleft}": "shift ⇧",
        "{shiftright}": "shift ⇧",
        "{controlleft}": "ctrl ⌃",
        "{controlright}": "ctrl ⌃",
        "{altleft}": "alt ⌥",
        "{altright}": "alt ⌥",
        "{metaleft}": "cmd ⌘",
        "{metaright}": "cmd ⌘"
      }
    });

    this.keyboardControlPad = new Keyboard(".simple-keyboard-control", {
      ...this.commonKeyboardOptions,
      layout: {
        default: [
          "{prtscr} {scrolllock} {pause}",
          "{insert} {home} {pageup}",
          "{delete} {end} {pagedown}"
        ]
      }
    });

    this.keyboardArrows = new Keyboard(".simple-keyboard-arrows", {
      ...this.commonKeyboardOptions,
      layout: {
        default: ["{arrowup}", "{arrowleft} {arrowdown} {arrowright}"]
      }
    });

    this.keyboardNumPad = new Keyboard(".simple-keyboard-numpad", {
      ...this.commonKeyboardOptions,
      layout: {
        default: [
          "{numlock} {numpaddivide} {numpadmultiply}",
          "{numpad7} {numpad8} {numpad9}",
          "{numpad4} {numpad5} {numpad6}",
          "{numpad1} {numpad2} {numpad3}",
          "{numpad0} {numpaddecimal}"
        ]
      }
    });

    this.keyboardNumPadEnd = new Keyboard(".simple-keyboard-numpadEnd", {
      ...this.commonKeyboardOptions,
      layout: {
        default: ["{numpadsubtract}", "{numpadadd}", "{numpadenter}"]
      }
    });
  }

  onChange = (input: string) => {
    this.value = input;
    console.log("Input changed", input);
  };

  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   // GLOBAL KEY DETECTION!!!
  //   console.log(event.key);
  //   console.log(event.shiftKey);
  //
  //   /**
  //    * If you want to handle the shift and caps lock buttons
  //    */
  //   if (event.key.includes("i")){
  //     console.log("INCLUDES");
  //   }
  //   if (event.shiftKey || event.key.includes("lock")) this.handleShift();
  // }

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    this.keyboard.addButtonTheme(button, "my-button");
    this.activateButtonTheme(button);
    // if (button.includes("shift") || button === "{lock}") this.handleShift();
  };

  commonKeyboardOptions = {
    // onChange: (input: string) => this.onChange(input),
    onKeyPress: (button: string) => this.onKeyPress(button),
    // onKeyReleased: (button: string) => this.onKeyReleased(button),
    theme: "simple-keyboard hg-theme-default hg-layout-default",
    physicalKeyboardHighlight: true,
    physicalKeyboardHighlightPress: true,
    syncInstanceInputs: true,
    preventMouseDownDefault: true,
    mergeDisplay: true
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  private resetButtonTheme(button: string) {
    this.keyboard.removeButtonTheme(button, "my-button");
  }

  private activateButtonTheme(button: string) {
    this.keyboard.addButtonTheme(button, "my-button");
  }

  // handleShift = () => {
  //   console.log("Handle shift!");
  //   let currentLayout = this.keyboard.options.layoutName;
  //   let shiftToggle = currentLayout === "default" ? "shift" : "default";
  //
  //   this.keyboard.setOptions({
  //     layoutName: shiftToggle
  //   });
  // };

  // onKeyReleased(button: string) {
  //   console.log("RELEASED: ", button);
  //   // if (button.includes("shift") || button === "{lock}") this.handleShift();
  // };

}
