# scatter-render-60FPS
Various branches for various render targets (prepping for testing FF WebRender)

Code for https://twitter.com/monfera/status/919344656525266944 pens in one place, plus a couple of WebGL versions that simplify calculations - with WebGL, actually updating positions is a bottleneck and we want to measure rerendering.
Of course, with the WebGL case, animation is better done via sending two `position` attribs and tween with a `uniform` as in http://bl.ocks.org/monfera/85aa9627de1ae521d3ac5b26c9cd1c49
Yet it's quite impressive that on a laptop with integrated graphics, even 1 million points can be animated at 60FPS by resending the entire array buffer.
