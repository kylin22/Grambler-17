interface AudioLookup {
  [key: string]: HTMLAudioElement
}

export default class AudioManager {
  private audioElements: AudioLookup = {};

  public addAudio(name: string, path: string) {
    const audioElement = new Audio(path);
    console.log(audioElement)
    this.audioElements[name] = audioElement;
  }

  public playSound(SFXKey: string) {
    const soundEffect = this.audioElements[SFXKey];
    if (soundEffect) {
      soundEffect.currentTime = 0;
      soundEffect.play();
    }
  }
}