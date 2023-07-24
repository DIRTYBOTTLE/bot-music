import "./css/index.css";
// 0724-12
class BotMusic {
  constructor({
    el = undefined,
    sever = "netease",
    type = "playlist",
    id = "439665401",
  } = {}) {
    this.el = el;
    this.sever = sever;
    this.type = type;
    this.id = id;
    this.musicList = undefined;
    this.musicIndex = 0;

    this.init();
  }

  createEl() {
    const container = document.querySelector(this.el);
    container.innerHTML = `
    <audio id="audioBot"></audio>
    <div id="lyrBot"></div>
    <div class="music-bot">
      <button id="playBot"/>
      <button id="nextBot">切</button>
      <button id="lyrSwitchBot">词</div>
    </div>
    `;

    this.audio = container.querySelector("#audioBot");
    this.lyr = container.querySelector("#lyrBot");
    this.play = container.querySelector("#playBot");
    this.next = container.querySelector("#nextBot");
    this.lyrSwitch = container.querySelector("#lyrSwitchBot");
    this.container = container;

    this.play.addEventListener("click", this.toggleMusic.bind(this));
    this.next.addEventListener("click", this.nextMusic.bind(this));
    this.audio.addEventListener("error", this.nextMusic.bind(this));
    this.audio.addEventListener("ended", this.nextMusic.bind(this));
    this.audio.addEventListener("timeupdate", this.dispalyLyric.bind(this));
    this.lyrSwitch.addEventListener("click", () =>
      this.lyr.classList.toggle("hidden")
    );
  }

  async init() {
    this.createEl();
    await this.getMusicList();
    await this.getMusic(this.musicList[this.musicIndex]);
    this.play.classList.remove("pause");
    this.audio.pause();
  }

  async getMusicList() {
    this.musicList = await fetch(
      "https://api.i-meto.com/meting/api?server=" +
        this.sever +
        "&type=" +
        this.type +
        "&id=" +
        this.id
    ).then((res) => res.json());
  }

  async getMusic(music) {
    const lyric = await fetch(music.lrc).then((res) => res.text());
    this.lyric = lyric.split("\n");
    this.lyricIndex = 0;
    this.container.title = music.title;
    this.audio.src = music.url;
  }

  toggleMusic() {
    if (this.audio.paused) {
      this.play.classList.add("pause");
      this.audio.play();
      return;
    }
    if (!this.audio.paused) {
      this.play.classList.remove("pause");
      this.audio.pause();
    }
  }

  async nextMusic() {
    this.musicIndex++;
    if (this.musicIndex === this.musicList.length) {
      this.musicIndex = 0;
    }
    await this.getMusic(this.musicList[this.musicIndex]);
    this.audio.play();
    this.play.classList.add("pause");
  }

  dispalyLyric() {
    if (!this.lyric) {
      this.lyr.innerText = this.musicList[this.musicIndex].title;
      return;
    } else {
      const reTime = /([0-5][0-9]:[0-5][0-9].[0-9][0-9])/;
      const timeStr = reTime.exec(this.lyric[this.lyricIndex]);
      if (timeStr !== null) {
        const time = timeStr[0].split(":");
        const min = Number(time[0]);
        const sec = Number(time[1]);
        const sumSec = min * 60 + sec;
        let sumSecNext = 0;
        if (this.lyric[this.lyricIndex + 1]) {
          const timeStrNext = reTime.exec(this.lyric[this.lyricIndex + 1]);
          if (!timeStrNext) {
            this.lyr.innerText = this.musicList[this.musicIndex].title;
            return;
          }
          const timeNext = timeStrNext[0].split(":");
          const minNext = Number(timeNext[0]);
          const secNext = Number(timeNext[1]);
          sumSecNext = minNext * 60 + secNext;
        } else {
          sumSecNext = 100000;
        }
        if (this.audio.currentTime < sumSec) {
          const words = this.lyric[this.lyricIndex].split("]")[1];
          if (!words) {
            this.lyr.innerText = this.musicList[this.musicIndex].title;
            return;
          }
          this.lyr.innerText = words;
        } else if (
          sumSec < this.audio.currentTime &&
          this.audio.currentTime < sumSecNext
        ) {
          const words = this.lyric[this.lyricIndex].split("]")[1];
          if (!words) {
            this.lyr.innerText = this.musicList[this.musicIndex].title;
            return;
          }
          this.lyr.innerText = words;
        } else {
          this.lyricIndex++;
        }
      } else {
        if (!this.lyric[this.lyricIndex]) {
          this.lyr.innerText = this.musicList[this.musicIndex].title;
          return;
        }
        this.lyr.innerText = this.lyric[this.lyricIndex];
        this.lyricIndex++;
      }
    }
  }
}

export default BotMusic;
