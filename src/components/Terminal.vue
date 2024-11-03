<template>
  <div id="terminal" v-html="terminalText"></div>
  <span v-if="terminalSpinner">{{ terminalSpinner }}</span>
  <span v-if="terminalSpinner">&nbsp {{ terminalPercentage }}%</span>
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

  const terminalText = ref("");
  const terminalSpinner = ref("");
  const terminalPercentage = ref(0);
  const spinnerFrames = ["|", "/", "-", "\\"];

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
        terminalText.value += OS_HEADER;

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
        terminalText.value += line.text;
        currentLine++;
        terminalText.value += "<br>";
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
  b {
    font-weight: 1000;
  }
</style>