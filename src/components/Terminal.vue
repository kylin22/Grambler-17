<template>
  <div id="terminal" v-html="terminalText">
  </div>
</template>

<script lang="ts" setup>
  import intro from "../assets/terminal_text/intro.json"; 
import AudioManager from "../utils/audioManager";

  interface TextBlock {
    "text": string[]
  }

  const TEXT_SPEED = 100;
  const TERMINAL_HEADER = "/> ";
  const terminalText = ref("");

  const generateText = (textBlock: TextBlock) => {
    let currentLine = 0;
    const generateLine = (line: string) => {
      let currentCharacter = 0;
      currentLine++;
      terminalText.value += TERMINAL_HEADER;
      audioManager.playSound("newLine");
      const textGenerator = setInterval(() => {
        terminalText.value += line[currentCharacter];
        currentCharacter++;
        if (currentCharacter >= line.length) {
          clearInterval(textGenerator);
          if (currentLine < textBlock.text.length) {
            terminalText.value += "<br>";
            generateLine(textBlock.text[currentLine]);
          }
        }
      }, TEXT_SPEED);
    }
    generateLine(textBlock.text[currentLine]);
  }

  const audioManager = new AudioManager();

  onMounted(() => {
    audioManager.addAudio("newLine", "/sfx/message-alert-normal.wav");
    generateText(intro as TextBlock);
  });
</script>

<style lang="scss" scoped>

</style>