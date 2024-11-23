<template>
  <!-- Credit to Nikita Kryukov's website https://passwordpassword.online/ for inspiring this implementation in Nuxt! -->
  <div id="terminal" @scroll="handleManualScroll">
    <div id="history" v-html="terminalText"></div>
    <div>
      <span v-if="terminalSpinner">{{ terminalSpinner }}</span>
      <span v-if="terminalSpinner">&nbsp {{ terminalPercentage }}%</span>
    </div>
    <!-- zero-width space to fix cursor jumping -->
    <div v-if="inputCollect" class="selectable" contenteditable id="collector" name="collector" autocomplete="off" @keydown.enter.prevent="handleInput" spellcheck="false">&#8203</div>
    <div id="anchor"></div>
  </div>
  <span v-if="scrolled" id="scrollable">&#8615</span>
</template>

<script lang="ts" setup>
  import textData from "../assets/text/terminal.json";
  import { LoadTypes, type CollectOptions, type LoadLine, type LoadSequence, type Speech, type TextData } from "../assets/text/terminalTypes";
  import AudioManager from "../utils/audioManager";
  import TerminalEventHandler from "../utils/eventHandler";

  const TEXT_SPEED = 75;
  const LINE_PAUSE = 1500;
  const LOAD_SPINNER_FRAME = 100;
  const SPEECH_HEADER = "sysguide:/> ";
  const OS_HEADER = "/> "

  const username = ref("'kylin:/>\u0020'");
  const terminalText = ref("");
  const terminalSpinner = ref("");
  const terminalPercentage = ref(0);
  const spinnerFrames = ["|", "/", "-", "\\"];
  const inputCollect = ref(false);
  const scrolled = ref(false);
  const currentTextBlock = ref<LoadSequence | Speech | null>(null);
  const eventHandler = new TerminalEventHandler();

  const handleManualScroll = () => {
    const terminal = document.getElementById("terminal");
    const history = document.getElementById("history");
    if (terminal && history && terminal.getBoundingClientRect().bottom >= history.getBoundingClientRect().bottom) {
      scrolled.value = false;
    } else {
      scrolled.value = true;
    }
  }

  const scrollToBottom = () => {
    const anchor = document.getElementById("anchor");
    if (anchor && !scrolled.value) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  
  onUpdated(() => {
    // scrollToBottom(); //TODO fix this shi
  });

  const handleInput = async() => {
    const collector = document.getElementById('collector');
    if (!collector) {
      return;
    }

    let input = collector.innerHTML;
    input = input.replace(/[\u200B-\u200D\uFEFF]/g, ''); //remove zero-width space
    if (currentTextBlock.value?.prompt) {
      const answers = currentTextBlock.value.prompt;
      const result = answers[input];
      terminalText.value += `${username.value.replace(/\'/gi, "")}${input}<br>`;
      if (result) {
        switch ((textData as TextData)[result].contentType) {
          case "speech":
            generateSpeech((textData as TextData)[result] as Speech);
            break;
          case "loadingSequence":
            generateLoadSequence((textData as TextData)[result] as LoadSequence);
            break;
        }
      } else {
        terminalText.value += `${OS_HEADER}Error: Invalid Input!<br>`;
        collector.innerHTML = "&#8203";
        return;
      }
    } else if (currentTextBlock.value?.collect) {
      const error = await eventHandler.parseInput(currentTextBlock.value.collect as CollectOptions, input);
      if (error) {
        terminalText.value += `${OS_HEADER}Error: ${error.invalid}<br>`;
        collector.innerHTML = "&#8203";
        return;
      }
    }
    inputCollect.value = false;
  }

  const createInput = () => {
    inputCollect.value = true;
    const collector = document.getElementById('collector');
    if (collector) {
      collector.focus();
    }
  }

  const generateSpeech = (textBlock: Speech) => {
    let currentLine = 0;
    currentTextBlock.value = textBlock;
    const generateLine = (line: string) => {
      setTimeout(() => {
        let currentCharacter = 0;
        currentLine++;
        terminalText.value += SPEECH_HEADER;
        audioManager.playSound("newLine");

        const textGenerator = setInterval(() => {
          terminalText.value += line[currentCharacter];
          currentCharacter++;
          if (currentCharacter >= line.length) {
            clearInterval(textGenerator);
            if (currentLine < textBlock.content.length) {
              terminalText.value += "<br>";
              generateLine(textBlock.content[currentLine]);
            }
          }
        }, TEXT_SPEED);
        if (currentLine >= textBlock.content.length) {
          if (textBlock.collect || textBlock.prompt) {
            setTimeout(createInput, line.length * TEXT_SPEED);
          }
          terminalText.value += "<br>";
          return;
        } 
      }, LINE_PAUSE);
    }
    generateLine(textBlock.content[currentLine]);
  }

  const generateLoadSequence = (textBlock: LoadSequence) => {
    let currentLine = 0;
    currentTextBlock.value = textBlock;

    const loadPercentage = (time: number, stuck: boolean) => {
      const tickInterval = stuck ? time / (Math.random() * 100) : time / 100
      const incrementPercentage = setInterval(() => {
        terminalPercentage.value++;
      }, tickInterval);
      setTimeout(() => {
        clearInterval(incrementPercentage);
        terminalPercentage.value = 0;
        if (!stuck) {
          terminalText.value += `${OS_HEADER}Done<br>`;
        } else {
          terminalText.value += `${OS_HEADER}Error Encountered >><br>`;
        }
      }, time);
    }

    const loadSpinner = (time: number) => {
      let currentFrame = 0;
      const animateSpinner = setInterval(() => {
        terminalSpinner.value = spinnerFrames[currentFrame];
        currentFrame = (currentFrame + 1) % spinnerFrames.length;
      }, LOAD_SPINNER_FRAME);
      setTimeout(() => {
        clearInterval(animateSpinner);
        terminalSpinner.value = "";
      }, time);
    }

    const generateLine = (line: LoadLine) => {
      setTimeout(() => {
        switch (line.loadType) {
          case LoadTypes.None: 
            audioManager.playSound("newLine");
            break;
          case LoadTypes.Spinner:
            audioManager.playSound("newLine");
            const spinnerTimeBlock = textBlock.content[currentLine + 1];
            if (spinnerTimeBlock.loadTime) { 
              loadSpinner(spinnerTimeBlock.loadTime);
              loadPercentage(spinnerTimeBlock.loadTime, line.stuck ? true : false); 
            }
            break; 
          case LoadTypes.Error: 
            audioManager.playSound("warn");
            break;
        }       
        terminalText.value += `${OS_HEADER}${line.text}<br>`;
        currentLine++;
        if (currentLine >= textBlock.content.length) {
          if (textBlock.collect || textBlock.prompt) {
            createInput();
          }
          return;
        } 
        generateLine(textBlock.content[currentLine]);
      }, line.loadTime ? TEXT_SPEED + line.loadTime : TEXT_SPEED);
    }
    generateLine(textBlock.content[currentLine]);
  }

  const audioManager = new AudioManager();

  onMounted(() => {
    audioManager.addAudio("newLine", "/sfx/message-alert-normal.wav");
    audioManager.addAudio("warn", "/sfx/message-alert-warn.wav");
    generateLoadSequence(textData.introLoad as LoadSequence);
  });
</script>

<style lang="scss" scoped>
  @import "../assets/theme.scss";

  b {
    font-weight: 1000;
  }

  #terminal {
    display: flex;
    flex-direction: column;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  #history {
    flex-grow: 1;
  }

  #collector {
    white-space: pre;
    font-size: inherit;
    color: inherit;
    min-height: 1em;
    flex-grow: 1;
    padding: 0;
    background-color: transparent;
    outline: 0;
    border: 0;
    resize: none;
    text-wrap: wrap;
    word-break: break-all;

    &::selection {
      color: $background-color;
      background: $primary-color;
    }

    &::before {
      content: v-bind("username");
    }
  }

  #collector-label {
    pointer-events: none;
    user-select: none;
  }

  #scrollable {
    position: absolute;
    padding-right: 10px;
    right: 0;
    bottom: 0;
    font-size: 2.5em;
    animation: bobbing 1s ease-in-out infinite;
  }

  @keyframes bobbing {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-5px);
    }

    100% {
      transform: translateY(0);
    }
  }
</style>