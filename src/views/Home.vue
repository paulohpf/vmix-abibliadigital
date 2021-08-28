<template>
  <div class="home">
    <Navbar />
    <v-container>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ornare in
      arcu at pretium. Proin rutrum libero mi, a tempor eros consectetur
      interdum. Sed eleifend scelerisque ex, non efficitur nibh posuere non.
      Quisque eu est at est finibus pulvinar. Fusce a nunc accumsan, iaculis mi
      ut, pellentesque tellus. Duis faucibus scelerisque nisi. Suspendisse ac
      commodo nunc, eu varius urna. Fusce pulvinar lobortis tincidunt. Nam
      varius ultricies ante sit amet dapibus. Nam mattis turpis vitae nisl
      bibendum mollis. Aliquam ac metus vel ante efficitur pellentesque id in
      lacus. Donec quis fringilla diam. Phasellus a elementum est. Proin aliquam
      consequat bibendum. Ut dapibus diam elit, eget faucibus est mollis eu.
      Aliquam ac lobortis felis, quis dignissim sapien. Fusce et mauris ex. Sed
      fringilla eleifend posuere. Nam in pellentesque enim, eu placerat lectus.
      Vivamus suscipit, leo a rhoncus faucibus, turpis lacus laoreet nunc, in
      ullamcorper lorem enim scelerisque sapien. Sed risus ipsum, malesuada et
      purus eu, dignissim blandit mauris. Etiam lobortis neque quis ultricies
      dictum. Nulla id orci sollicitudin, varius magna eget, sodales arcu. Proin
      sit amet nunc rhoncus, tempus neque ut, vehicula est. Vestibulum in
      venenatis ipsum. Integer sit amet commodo turpis. Aliquam malesuada orci
      suscipit tellus egestas, id imperdiet turpis tincidunt. Etiam pharetra
      mauris at justo tristique lacinia. Phasellus rhoncus mattis sapien, sed
      tristique tellus fringilla ut. Nam non suscipit leo. Aliquam erat
      volutpat. Vestibulum elementum iaculis mauris. Aliquam enim magna,
      bibendum sit amet quam sit amet, congue bibendum nunc. Vestibulum at est
      purus. Vivamus elementum dui at sapien aliquet accumsan. Fusce ullamcorper
      massa ante, a lacinia eros bibendum quis. Vestibulum eu leo leo. In hac
      habitasse platea dictumst. Nulla gravida risus sit amet est convallis
      ultrices. In cursus, risus non luctus ullamcorper, justo nisl ultricies
      quam, at suscipit mauris turpis sed arcu. Aenean rhoncus, lorem ut finibus
      dignissim, lacus magna vulputate orci, id bibendum turpis neque sed
      libero. Aenean sed diam dolor. Sed pellentesque congue augue nec feugiat.
      Vestibulum finibus, velit vitae egestas imperdiet, mauris leo convallis
      odio, rutrum pretium nisl ex at ligula. Maecenas a nisl nec nisl fermentum
      imperdiet. Praesent eget consectetur turpis. Vivamus vestibulum ante ut
      sodales rutrum. Mauris eget magna dolor. Pellentesque eu nunc sed libero
      pulvinar mattis ut quis odio. Nam id justo tempus, placerat risus ut,
      tristique lacus. Cras ut suscipit mi. Sed ornare, dolor sed sagittis
      dapibus, tellus magna mollis purus, a facilisis ipsum ante at sem. Donec
      porttitor elementum eros, nec sodales lectus maximus id. Nam consequat sem
      a enim elementum hendrerit. Duis vulputate quis mauris eu dignissim. Donec
      a molestie velit. Nunc mattis suscipit orci, non efficitur enim dignissim
      in. Proin non nunc eget enim tristique sodales. Donec in risus
      condimentum, semper urna in, lacinia massa. Nam accumsan vel dui sit amet
      venenatis. Maecenas eu lacus in nisi placerat laoreet ac a ligula. Sed
      dignissim, odio vitae aliquet facilisis, dolor diam ultricies orci, ac
      euismod ante ipsum in massa. Orci varius natoque penatibus et magnis dis
      parturient montes, nascetur ridiculus mus. Curabitur tempus erat eget enim
      sodales mattis. Nullam commodo risus dignissim, vestibulum diam sit amet,
      imperdiet libero.
    </v-container>
  </div>
</template>

<script>
export default {
  components: {
    Navbar: () => import('@/components/Navbar.vue'),
  },
  mounted() {
    console.log(this);
  },
};
</script>

<style lang="sass" scoped></style>
