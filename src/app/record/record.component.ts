import {Component, ViewEncapsulation} from '@angular/core';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import 'recordrtc';


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
  keyboards: Keyboard[] = [];

  mediaRecorder: MediaRecorder;
  audioChunks: BlobPart[];
  audioChunksForButton: Map<string, BlobPart[]>;
  audioChunksArray: any[] = [];
  audioBlob: Map<string, Blob | MediaSource> = new Map<string, Blob>();
  audioBlobUrl: Map<string, string> = new Map<string, string>();

  lastButtonPressed: string;
  lastTimeOfButtonPress: number;

  minimumTimeOfRecording: number = 300;

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
    this.keyboards.push(this.keyboard, this.keyboardArrows, this.keyboardNumPad, this.keyboardControlPad, this.keyboardNumPad);
    this.startAudioRecording();
    this.lastTimeOfButtonPress = new Date().getTime();
  }

  onChange = (input: string) => {
    // this.value = input;
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

  onKeyPress =  async (button: string) => {
    console.log("Button pressed", button);
    this.lastButtonPressed = button;
    /**
     * If you want to handle the shift and caps lock buttons
     */

    this.activateButtonTheme(button);

    // if (button.includes("shift") || button === "{lock}") this.handleShift();
    if (this.audioBlobUrl.get(button)) {
      let audio = new Audio(this.audioBlobUrl.get(button));
      audio.play();
    } else {
      await this.delay(1000)
      this.restartAndProcessAudioRecording();
    }
    this.lastTimeOfButtonPress = new Date().getTime();
  };

  commonKeyboardOptions = {
    onChange: (input: string) => this.onChange(input),
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

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private resetButtonTheme(button: string, className: string) {
    this.keyboards.forEach(keyboard => {
      keyboard.removeButtonTheme(button, className);
    });
  }

  private async activateButtonTheme(button: string) {
    this.keyboards.forEach(keyboard => {
      keyboard.addButtonTheme(button, "activated");
    });
    await this.delay(1000);
    this.resetButtonTheme(button, "activated");
    this.keyboards.forEach(keyboard => {
      keyboard.addButtonTheme(button, "pressed");
    });
  }

  private startAudioRecording() {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        // start recoring microphone
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start(100);


        this.audioChunksForButton = new Map<string, BlobPart[]>();
        this.audioChunks = [];

        this.mediaRecorder.addEventListener("dataavailable", event => {
          this.audioChunks.push(event.data);
          console.log(event.data.type)
          console.log(this.audioChunksForButton.keys());
          console.log(this.audioChunksForButton.values());
        })

        this.mediaRecorder.addEventListener("stop", () => {
          this.audioChunksForButton.set(this.lastButtonPressed, this.audioChunks);
          this.createAudioBlob();
        });

      });
  }

  private restartAndProcessAudioRecording() {
    if (new Date().getTime() - this.lastTimeOfButtonPress > this.minimumTimeOfRecording){
      this.mediaRecorder.stop();
      this.startAudioRecording();
    } else {
      alert("You have to record for at least " + this.minimumTimeOfRecording + " milliseconds!");
    }
  }

  // ASYNC: Make button red for 1s, then blue again
  // private async activateButtonTheme(button: string) {
  //   this.keyboards.forEach(keyboard => {
  //     keyboard.addButtonTheme(button, "activated");
  //   });
  //   await this.delay(1000);
  //   this.keyboards.forEach(keyboard => {
  //     keyboard.removeButtonTheme(button, "activated");
  //   });
  //   this.keyboards.forEach(keyboard => {
  //     keyboard.addButtonTheme(button, "pressed");
  //   });
  // }
// "audio/webm;codecs=opus"
  private createAudioBlob() {
    console.log("create audio blob...");
    this.audioBlob.set(this.lastButtonPressed, new Blob(this.audioChunksForButton.get(this.lastButtonPressed)));
    this.audioBlobUrl.set(this.lastButtonPressed, URL.createObjectURL(<Blob>this.audioBlob.get(this.lastButtonPressed)));
    // let audiobuffer = new AudioBuffer()
    console.log(this.audioBlob);
    console.log(this.audioBlobUrl);
    // play audio
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
