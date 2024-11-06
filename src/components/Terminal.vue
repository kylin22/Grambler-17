<template>
  <!-- Credit to Nikita Kryukov's website https://passwordpassword.online/ for inspiring this implementation in Vue! -->
  <div id="terminal">
    <div id="history" v-html="terminalText"></div>
    <div>
      <span v-if="terminalSpinner">{{ terminalSpinner }}</span>
      <span v-if="terminalSpinner">&nbsp {{ terminalPercentage }}%</span>
    </div>
    <!-- zero-width space to fix cursor jumping -->
    <div v-if="inputCollect" class="selectable" contenteditable id="collector" name="collector" autocomplete="off" @keydown.enter.prevent="handleInput" spellcheck="false">&#8203</div>
  </div>
</template>

<script lang="ts" setup>
  import textData from "../assets/text/terminal.json";
  import { LoadTypes, type LoadLine, type LoadSequence, type Speech } from "../assets/text/terminalTypes";
  import AudioManager from "../utils/audioManager";

  const TEXT_SPEED = 75;
  const LINE_PAUSE = 1000;
  const LOAD_SPINNER_FRAME = 100;
  const SPEECH_HEADER = "/SysGuide>";
  const OS_HEADER = "/> "

  const username = ref("'kylin:/>\u0020'");
  const terminalText = ref("");
  const terminalSpinner = ref("");
  const terminalPercentage = ref(0);
  const spinnerFrames = ["|", "/", "-", "\\"];
  const inputCollect = ref(false);
  const currentTextBlock = ref<LoadSequence | Speech | null>(null);

  const handleInput = () => {
    const collector = document.getElementById('collector');
    if (!collector) {
      return;
    }
    let input = collector.innerHTML;
    input.replace("&#8203", "");
    console.log(input)
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
    // generateSpeech(textData.introWelcome as Speech);
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
  }
  #history {
    flex-grow: 0;
  }

  #collector {
    white-space: pre;
    font-size: inherit;
    color: inherit;
    flex-grow: 1;
    padding: 0;
    background-color: transparent;
    outline: 0;
    border: 0;
    overflow: hidden;
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
</style>