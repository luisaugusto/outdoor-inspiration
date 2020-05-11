<template>
  <div id="app" :class="['page', { display: imgLoaded }]">
    <div class="background">
      <img :src="image" alt="" @load="imgLoaded = true" />

      <div class="loading"></div>
    </div>

    <div class="info">
      <section class="title-location">
        <h1>{{ park.title }}</h1>
        <div class="location">{{ park.location }}</div>
      </section>
      <div class="icons">
        <a :href="park['nps-url']" target="_blank"
          ><i class="fas fa-map-marked-alt"></i
        ></a>
        <a :href="flickrUrl" target="_blank"><i class="fab fa-flickr"></i></a>
      </div>
    </div>
    <section class="description">
      {{ park.description }}<br /><br /><span class="est"
        >Est. {{ park.date }}</span
      >
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    delayRequests: false, //Set to true if you want to limit requests to Flickr to 1 per hour
    imgLoaded: false
  }),
  computed: {
    park() {
      return this.$store.state.activePark;
    },
    flickrUrl() {
      return this.park.photo
        ? `https://www.flickr.com/photos/${this.park.photo.owner}/${this.park.photo.id}`
        : "";
    },
    image() {
      return this.park.photo
        ? this.park.photo.url_k ||
            this.park.photo.url_h ||
            this.park.photo.url_l
        : "";
    }
  },
  created() {
    console.info(
      "Want to contribute to this project? Visit https://github.com/luisaugusto/outdoor-inspiration"
    );

    this.$store.dispatch("getParks").then(() => {
      const parkExp = localStorage.getItem("parkExp");
      if (
        this.delayRequests &&
        Date.now() < parseInt(parkExp) + 1000 * 60 * 6
      ) {
        const parkStorage = localStorage.getItem("park");
        this.$store.commit("setPark", JSON.parse(parkStorage));
      } else {
        this.$store.dispatch("getActivePark").then(() => {
          localStorage.setItem("park", JSON.stringify(this.park));
          localStorage.setItem("parkExp", String(Date.now()));
        });
      }
    });
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:ital,wght@0,400;0,700;1,300&display=swap");
body {
  margin: 0;
  background: black;
  color: white;
}

.page {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  line-height: 1.3;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  text-shadow: 1px 1px 1px black;

  @media (max-width: 767px) {
    font-size: 16px;
  }
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;

    opacity: 0;
    transition: opacity 0.5s;

    .display & {
      opacity: 1;
    }
  }

  .loading {
    width: 80px;
    height: 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;

    .display & {
      opacity: 0;
    }

    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      animation: loading 1.2s linear infinite;
      border: 2px solid white;
      border-radius: 100%;

      @keyframes loading {
        0% {
          height: 0;
          width: 0;
        }

        80%,
        100% {
          height: 100px;
          width: 100px;
          opacity: 0;
        }
      }
    }

    &:after {
      animation-delay: 0.2s;
      border-width: 1px;
    }
  }
}

.description,
.title-location,
.icons {
  transition: opacity 0.5s, transform 0.5s;
  opacity: 0;

  .display & {
    opacity: 1;
  }
}

.icons {
  display: flex;
  justify-content: flex-end;

  a {
    color: white;
    text-decoration: none;

    + a {
      margin-left: 15px;
    }
  }
}

.info {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 700px 1fr;
  align-items: flex-start;
  padding: 60px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr auto;
  }

  @media (max-width: 767px) {
    padding: 30px;
  }

  @media (max-width: 450px) {
    padding: 15px;
  }
}

.title-location {
  transform: translateY(-100%);

  .display & {
    transform: translateY(0%);
  }

  h1 {
    font: 300 60px "Open Sans Condensed", sans-serif;
    margin: 0;
    line-height: 1;

    @media (max-width: 767px) {
      font-size: 36px;
    }
  }

  .location {
    font-weight: bold;
    font-size: 24px;
    margin-top: 15px;

    @media (max-width: 767px) {
      font-size: 18px;
    }
  }
}

.description {
  width: 1000px;
  box-sizing: border-box;
  max-width: calc(100vw - 60px);
  font-weight: 400;
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.6);
  margin: 30px;
  border: 4px double rgba(255, 255, 255, 0.2);
  outline: 15px solid rgba(0, 0, 0, 0.6);
  transform: translateY(100%);
  padding: 15px;

  .display & {
    transform: translateY(0%);
  }

  .est {
    font-size: 0.8em;
    font-style: italic;
  }
}
</style>
