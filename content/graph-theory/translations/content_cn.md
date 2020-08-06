#图和网络

## 介绍

> id: intro-0
> section: introduction
> translated: auto

每天，我们到处都是无数的连接和网络：道路和铁轨，电话线，互联网，电子电路，甚至还有分子键。朋友和家人之间甚至还有_社交网络_ 。您还能想到其他示例吗？ 

::: column(width=220 parent="padded-thin")

    x-img(src="images/network1.jpg" width=220 height=220 lightbox)

{.caption}公路和铁路网

::: column(width=220)

    x-img(src="images/network6.jpg" width=220 height=220 lightbox)

{.caption}电脑芯片

::: column(width=220)

    x-img(src="images/network3.jpg" width=220 height=220 lightbox)

{.caption}供应链

::: column(width=220)

    x-img(src="images/network2.jpg" width=220 height=220 lightbox)

{.caption}友情

::: column(width=220)

    x-img(src="images/network7.jpg" width=220 height=220 lightbox)

{.caption}神经连接

::: column(width=220)

    x-img(src="images/network4.jpg" width=220 height=220 lightbox)

{.caption}互联网

:::

---
> id: intro

::: column.grow

在数学中，所有这些示例都可以表示为[__图形__](gloss:graph) （不要与函数的_图形_混淆）。图由某些称为[[顶点的]] _点_组成[[|界|交叉口]] ，其中一些通过[[边]]连接[[|界线|对]] 。 

__图论__是对图及其性质的研究。它是数学中最令人兴奋和视觉化的领域之一，具有无数重要的应用。 

::: column(width=180)

    svg#graph0.graph.novertices.noedges(width=180 height=180)

:::

---
> id: intro-1

我们可以使用圆和线来绘制简单图形的布局。顶点的位置和边缘的长度无关紧要-我们只关心_它们如何相互连接_ 。边缘甚至可以彼此交叉，并且不必笔直。 

::: column(width=200)

    svg.graph(height=120 width=200 style="margin: 0 auto .8em")

{.caption}在某些图中，边仅是一种方式。这些称为有[__向图__](gloss:directed-graph) 。 

::: column(width=200)

    svg.graph(height=120 width=200 style="margin: 0 auto .8em")

{.caption}一些图由多组顶点组成，这些顶点不通过边彼此连接。这些图是__断开的__ 。 

::: column(width=200)

    svg.graph(height=120 width=200 style="margin: 0 auto .8em")

{.caption}其他图可能在同一对顶点之间或在相互连接的顶点之间（回路）包含多个边。 

:::

---
> id: intro-2

我们可以通过删除一些顶点和边来从现有图创建新图。结果称为[__子图__](gloss:subgraph) 。在这里，您可以看到更多图形示例，其中彩色的边缘和顶点表示可能的子图形： 

::: column(width=212 parent="padded-thin")

    svg.graph(height=100 width=100 style='float: left; margin-right: 12px')
    svg.graph(height=100 width=100 style='float: left')

::: column(width=212)

    svg.graph(height=100 width=100 style='float: left; margin-right: 12px')
    svg.graph(height=100 width=100 style='float: left')

::: column(width=212)

    svg.graph(height=100 width=100 style='float: left; margin-right: 12px')
    svg.graph(height=100 width=100 style='float: left')

:::

---
> id: intro-3

我们说图的[__顺序__](gloss:graph-order)是它具有的顶点数。顶点的[__度数__](gloss:graph-degree)是在该顶点相遇的边的数量。 

::: column(width=130)

    svg.graph(height=120 width=120 style='margin: 0 auto .8em')

{.text-center}顺序： [[5]] 

::: column(width=130)

    svg.graph(height=120 width=120 style='margin: 0 auto .8em')

{.text-center}订购： [[8]] 

::: column(width=130)

    svg.graph(height=120 width=120 style='margin: 0 auto .8em')

{.text-center}学位： [[3]] 

::: column(width=130)

    svg.graph(height=120 width=120 style='margin: 0 auto .8em')

{.text-center}学位： [[6]] 

:::

---
> id: intro-4

由单个顶点循环组成的图称为[__循环__](gloss:graph-cycle) 。所有循环具有[[相同数量的边和顶点|边缘多于顶点|边缘少于顶点]] 。 

    .row
      svg.graph(style='width: 120px; height: 120px;')
      svg.graph(style='width: 120px; height: 120px;')
      svg.graph(style='width: 120px; height: 120px;')

{.reveal(when="blank-0")}配备了这些新定义后，让我们探索图形的一些引人入胜的特性和应用。 

---
> id: bridges-0
> title: The Bridges of Königsberg
> section: bridges
> translated: auto

## 柯尼斯堡的桥梁

::: column.grow

[Leonhard Euler](bio:euler)是最早考虑图和网络的数学家之一。欧拉对波罗的海附近的柯尼斯堡（Königsberg）镇的一个老问题深感兴趣。 

普雷格尔河将柯尼斯堡（Königsberg）分为四个独立的部分，由七个桥相连。是否可以一次穿越所有桥梁在城市中漫步-但不能超过一次？ （您可以在任何地方开始和结束，而不必在同一地方。） 

尝试通过在以下地图上绘制来找到有效的路线： 

::: column(width=250)

    img.shifted(src="images/konigsberg1.jpg" width=250 height=350)

:::

---
> id: bridges
> goals: bridge-0 bridge-1 bridge-2 bridge-3
> title: The Bridges of Königsberg

    x-tabbox.full-width
      .tab
        h3 Map 1#[span.check.incorrect(when="bridge-0")]
        x-solved
        include svg/bridges-1.svg
        button.btn Clear
        button.btn.right Skip
      .tab
        h3 Map 2#[span.check(when="bridge-1")]
        x-solved
        include svg/bridges-2.svg
        button.btn Clear
        button.btn.right Skip
      .tab
        h3 Map 3#[span.check(when="bridge-2")]
        x-solved
        include svg/bridges-3.svg
        button.btn Clear
        button.btn.right Skip
      .tab
        h3 Map 4 #[span.check.incorrect(when="bridge-3")]
        x-solved
        include svg/bridges-4.svg
        button.btn Clear
        button.btn.right Skip

---
> id: bridges-1

对于柯尼斯堡（Königsberg）来说，似乎不可能找到有效的路线，但其他一些城市也可以使用。欧拉设法使用图论找到了一条适用于任何城市的简单规则，而无需尝试很多可能性。 

::: column.grow

首先，我们需要将城市地图转换为带有边和顶点的图形。每个岛屿或陆地区域都由[[一个顶点]]表示[[|边缘|一个区域]]和连接两个区域的每个桥都由相应的[[边]]表示[[|顶点|街道]] 。 

{.reveal(when="blank-0 blank-1")}现在，“在一次穿越每座桥梁的同时精确地游览城市”的问题已成为“在连续追踪每条边缘一次的同时绘制一个连续笔划的图形”的问题。 

::: column(width=200)

    include svg/konigsberg.svg

:::

---
> id: bridges-2

在纸上，拿出一些不同的图，然后尝试找出可以用一个连续的笔划绘制的图。 

---
> id: bridges-3
> goals: size prime eo

就像以前的城市地图一样，我们发现有些图形是可能的，而其他图形则没有。为了帮助我们理解原因，让我们用[度数](gloss:graph-degree)标记每个顶点。然后，我们可以以不同的方式为顶点着色，并尝试揭示一个图案： 

    figure
      x-select.var.tabs(:bind="colour")
        div(value="val") Value
        div(value="size") Size
        div(value="prime") Prime Numbers
        div(value="eo") Even and Odd
      .box
        p.no-voice(style="margin: 0"): strong These graphs are possible:
        include svg/vertex-orders-1.svg
        p.no-voice(style="margin: 1em 0 0"): strong These graphs are not possible:
        include svg/vertex-orders-2.svg

---
> id: bridges-4

将这些数字与可能的图形和不可能的图形进行比较，似乎可以绘制出一个[[不超过两个“奇数”顶点]]的图形[[|只有“偶数”个顶点|没有顶点大于4的顶点|顶点数为奇数|没有3阶的顶点]] 。如果我们只看图中的一个顶点，就可以解释这种情况： 

    x-slideshow
      .stage(slot="stage"): include svg/konigsberg-proof.svg
      .legend(slot="legend") Here you can see a single, magnified vertex in a graph.
      .legend(slot="legend") If we draw the graph, we will eventually have an edge leading towards this vertex, and then another one leading away. This makes two edges meeting at the vertex.
      .legend(slot="legend") Maybe the vertex is a crossing rather than a corner. In that case there will be another edge leading towards the vertex, and another edge leading away. Now we have four edges.
      .legend(slot="legend") And in some graphs, there may even be a third pair of edges leading towards and away from the vertex. Now there are six edges.
      .legend(slot="legend") Notice that, either way, there always is an even number of edges meeting at the vertex.
      .legend(slot="legend") The only two exceptions are the vertices where the path starts, and where it ends – these two may have an odd number of edges. If the start and end point are the same, all vertices in the graph are even.

---
> id: bridges-5

::: column.grow(parent="right")

如果您滚动回柯尼斯堡（Königsberg）地图，将会发现有两个以上的岛，桥的数量奇数。因此，确实不可能一次只穿过每座桥梁的路线–这就是伦纳德·欧拉（Leonard Euler）所发现的。 

欧拉的发现在现实生活中似乎并不是特别有用，但是图表是许多其他地理问题（例如在两个位置之间找到方向）的基础。稍后我们将发现更多这些应用程序。 

::: column(width=240)

    x-img(lightbox width=240 height=260 src="images/prague.jpg")

:::

---
> id: handshakes-1
> section: handshakes
> translated: auto

## 握手和约会

::: column.grow

已邀请您与朋友一起参加精彩的生日聚会。包括你自己和主人，有${hnd}{hnd|5|3,15,1}人们在场。 

到了晚上，当客人准备离开时，每个人都与其他人握手。总共有多少次握手？ 

我们可以用图形来表示握手：每个人都是[[一个顶点|的边缘]] ，并且每一个信号交换是[[边缘|一个顶点]] 。 

{.reveal(when='blank-0 blank-1')}现在很容易计算图中的边数。我们发现那里${hnd}人，有${hnd*(hnd-1)/2}握手。 

::: column.s-hide(width=240)

    img.shifted(src="images/party.jpg" width=240 height152)
    svg.graph(style='width: 240px; height: 240px;')

:::

---
> id: handshakes-2

除了计算大型图中的所有边，我们还可以尝试找到一个简单的公式，该公式可以告诉我们_任意_数量的来宾的结果。 

每个${n}{n|5|2,8,1}参加聚会的人们与${n-1}其他。那使得${n} × ${n-1} = ${n×(n-1)}总共握手。对于_n_个人，握手次数为[[`n×(n–1)`|`n×(n+1)`|`n^2`]] 。 

    p.var(:html="handshakeTable(n)")
    x-gesture(target="#handshakes-2 x-var" slide="100,0")

---
> id: handshakes-2a

不幸的是，这个答案不太正确。注意如何<x-target to=".handshakes tr:first-child td:first-child, .handshakes tr:first-child td:nth-child(2)">第一行的前两个条目</x-target>其实是一样的，只是翻来覆去。 

实际上，我们已经计算了[[两次]]握手[[|一旦|三遍]] _{span.reveal(when="blank-0")}每个涉及的两个人一次。这意味着正确的握手次数${n}{n|5|2,25,1}客人是`(var("n") × var("n-1"))/2 = var("n*(n-1)/2")` 。_ 

---
> id: handshakes-3

握手图是特殊的，因为每个顶点都与其他每个顶点相连。具有此属性的__图__称为__完整图__ 。具有4个顶点的完整图形通常缩写为`K_4` ，具有5个顶点的完整图形称为`K_5` ， 等等。 

我们刚刚显示了具有`n`顶点`K_n` ， 有`(n × (n-1))/2`边缘。 

    .row
      svg.graph(style="width: 90px; height: 90px")
      svg.graph(style="width: 90px; height: 90px")
      svg.graph(style="width: 90px; height: 90px")
      svg.graph(style="width: 90px; height: 90px")

---
> id: handshakes-4

    figure: img(src="images/flags.jpg" width=855 height=100)

在另一天，我们邀请您参加${m}{m|5|2,8,1}男孩和${f}{f|4|2,8,1}女孩。有很多小桌子，每个男孩和每个女孩在一起都花5分钟。总共有多少个单独的“日期”？ 

::: column.grow

在这种情况下，对应的图由两组单独的顶点组成。每个顶点都连接到[[对面的]]所有顶点[[|自己的]]一套，但没有在[[自己的]]顶点[[|相反的]]集合。具有这种布局的__图__称为__二部图__ 。 

::: column(width=300)

    svg.graph(style="width: 300px; height: 140px;")

:::

{.reveal(when="blank-0 blank-1")}具有两组大小为_x_和_y_的二部图通常写为`K_"x,y"` 。它有[[`x×y`|`x+y`|`2x–y`]]边缘， _{span.reveal(when="blank-2")}这意味着在上面的示例中有${m} × ${f} = ${m×f}日期。_ 

---
> id: utilities
> goals: try-three-times
> section: planar-graphs
> translated: auto

## 平面图

::: column.grow

这是与图论有关的另一个难题。 

在一个小村庄里，有三座房屋和三个公用设施，可生产水，电和煤气。我们必须将每个课程都连接到每个公用事业工厂，但是由于村庄的布局，不同的管道和电缆不允许交叉。 

::: column(width=300)

    x-img(width=300 height=200 src="images/power-plant.jpg")

:::

尝试将每个房屋连接到下面的每个公用事业公司，而您的任何线路都不相交： 

    .box.no-padding
      include svg/utilities.svg
      button.btn Clear

---
> id: utilities-1

就像以前的柯尼斯堡桥一样，您很快就会发现这个问题也是不可能的。似乎可以绘制一些没有重叠边的图-这些被称为__平面图__ -但是其他图则不能。 

::: column(width=200)

    svg.graph(width=200 height=200 style="margin-bottom: .4em")

{.text-center}`K_3`是平面的。 

::: column(width=200)

    svg.graph#planar-2(width=200 height=200 style="margin-bottom: .4em")

{.text-center}`K_4` [[是平面的|不是平面的]] 。 

::: column(width=200)

    svg.graph#planar-3(width=200 height=200 style="margin-bottom: .4em;")

{.text-center}`K_5` [[不是平面的|是平面的]] 。 

:::

---
> id: utilities-2

[完整图](gloss:complete-graph) `K_5`是不是平面的最小图形。任何其他包含`K_5`因为子图在某种程度上也不是平面的。这包括`K_6` ， `K_7` ，以及所有较大的完整图形。 

三个实用程序难题中的[图](gloss:bipartite-graph)是[二部图](gloss:bipartite-graph) `K_"3,3"` 。事实证明，任何非平面图都必须包含一个`K_5`或一个`K_"3,3"` （或这两个图的[细分](gloss:subdivision) ）作为子图。这称为_Kuratowski定理_ 。 

---
> id: planarity
> goals: planarity

::: .box.f-blue

#### 平面度

    x-solved
    svg#planarity(viewBox="0 0 720 360")

这是一个平面图，但是${n}{n|7|5,20,1}顶点已被加乱。重新排列顶点，以使所有边缘均不重叠。 

    p.btn-row: button.btn New Random Graph

:::

---
> id: euler

### 欧拉公式

所有平面图将它们绘制的平面划分为多个区域，称为__Faces__ 。 

::: column(width=200)

    include svg/euler-2.svg

{.text-center} [[6个]]顶点  
[[5张]]面孔  
[[10条优势]]  
_{span.euler-sum} 11个顶点+面_ 

::: column(width=200)

    include svg/euler-1.svg

{.text-center} [[8个]]顶点  
[[7张]]面孔  
[[14条优势]]  
_{span.euler-sum} 15个顶点+面_ 

::: column(width=200)

    include svg/euler-3.svg

{.text-center} [[12个]]顶点  
[[13张]]面孔  
[[24条优势]]  
_{span.euler-sum} 25个顶点+面_ 

:::

---
> id: euler-1

比较这些数字时，您会注意到边缘的数量总是[[少一|大|与]]面数加顶点数相同。换一种说法， _{.b.blue} F_ + _{.b.green} V_ = _{.b.red} E_ +1。该结果称为__欧拉方程__ ，并以解决柯尼斯堡桥问题的同一位[数学家的](bio:euler)名字命名。 

不幸的是，有无限多的图，我们不能检查每个图来看看欧拉方程是否有效。相反，我们可以尝试找到适用于任何图形的简单[证明](gloss:proof) …… 

---
> id: euler-2

    x-slideshow
      .stage(slot="stage")
        svg(viewBox="0 0 640 200")
          line.link(style="stroke-width: 3px; display: none" x1=270 y1=30  x2=150 y2=100)
          line.link(style="stroke-width: 3px; display: none" x1=150 y1=100 x2=270 y2=170)
          line.link(style="stroke-width: 3px; display: none" x1=270 y1=170 x2=390 y2=100)
          line.link(style="stroke-width: 3px" x1="390" y1="100" x2="270" y2="30")
          circle.node(cx=270 cy=30  r=7)
          circle.node(cx=150 cy=100 r=7 style="display: none")
          circle.node(cx=270 cy=170 r=7 style="display: none")
          circle.node(cx=390 cy=100 r=7 style="display: none")
    
        .euler-table
          table.grid.table-small
            tr
              td: strong.blue.i F
              td: strong.green.i V
              td: strong.red.i E
            tr
              td.xf 0
              td.xv 1
              td.xe 0
          p.no-voice #[strong.blue.xf 0] + #[strong.green.xv 1] &nbsp;=&nbsp; #[strong.red.xe 0] + 1
    
      .legend(slot="legend") The simplest graph consists of a single vertex. We can easily check that Euler’s equation works.
      .legend(slot="legend") Let us add a new vertex to our graph. We also have to add an edge, and Euler’s equation still works.
      .legend(slot="legend") If we want to add a third vertex to the graph we have two possibilities. We could create a small triangle: this adds one vertex, one face and two edges, so Euler’s equation still works.
      .legend(slot="legend") Instead we could simply extend the line by one: this adds one vertex and one edge, and Euler’s equation works.
      .legend(slot="legend") Let’s keep going: if we now create a quadrilateral we add one vertex, two edges and one face. Euler’s equation still works.

---
> id: euler-3

可以通过从一个顶点开始并一个接一个地添加更多的顶点来构造任何（有限）图。我们已经表明，无论以哪种方式添加新顶点，欧拉方程都是有效的。因此，它对所有图形均有效。 

我们使用的过程称为__数学归纳法__ 。这是一种非常有用的技术，可通过从最简单的案例入手，并在构造更复杂的案例时证明每一步的结果都成立，从而在无限多的案例中证明结果。 

    .svg-block: include svg/dominoes.svg

---
> id: euler-4

许多平面图看起来非常类似于[多面体](gloss:polyhedron) （具有[多边形](gloss:polygon)面的三维形状）的网络。如果我们认为多面体是由弹性带制成的，我们可以想象将其拉伸直到它们变成平坦的平面图： 

::: column(width=300)

    img.img-sequence(src="images/cube/cube0.png" width=300 height=300)
    x-slider(steps=31)

::: column(width=300)

    img.img-sequence(src="images/dodecahedron/dodeca0.png" width=300 height=300)
    x-slider(steps=31)

:::

---
> id: euler-5

这意味着我们不仅可以将Euler公式用于平面图，而且可以将其用于所有多面体–差别很小。将多面体转换为图形时，其中一个面消失了：多面体的最上面的面成为“外面”；图。 

换句话说，如果您计算__{.red}边缘__ __{.blue}面孔__和__{.green}__ _任何_多面体的__顶点__ ，您会发现_{.b.blue} F_ + _{.b.green} V_ = _{.b.red} E_ + [[2]] 。 

::: column(width=200)

    x-video(width=200 height=200 src="images/icosahedron.mp4" hover loop)

{.caption} __二十面体__  
__{.blue} 20张__面孔  
__{.green} 12个__顶点  
__{.red} 30条优势__ 

::: column(width=200)

    x-video(width=200 height=200 src="images/rhombi.mp4" hover loop)

{.caption} __菱形十二面体__  
__{.blue} 62张__面孔  
__{.green} 60个__顶点  
__{.red} 120条__ 

::: column(width=200)

    x-video(width=200 height=200 src="images/football.mp4" hover loop)

{.caption} __二十面体截断__  
__{.blue} 32张__脸（12张黑，20张白）  
__{.green} 60个__顶点  
__{.red} 90条优势__ 

:::

---
> id: maps
> section: map-colouring
> translated: auto

## 地图着色

::: column.grow

我们已经在某些地图上使用了图论。当我们缩小地图时，个别的道路和桥梁消失了，而是看到了整个国家的轮廓。 

为地图或其他由不同区域组成的图形着色时，相邻国家/地区不能使用相同的颜色。我们可能还想使用尽可能少的不同颜色。 

一些简单的“地图”（例如棋盘）仅需要两种颜色（黑白），但是大多数复杂的地图需要更多颜色。 

::: column(width=240 style="margin-top: -10px")

    x-img.shifted(src="images/globe.jpg" width=240 height=320)

:::

---
> id: maps-1
> goals: map-0 map-1 map-2 map-3
> title: Colouring Maps

在为美国各州的地图着色时，显然50种颜色就足够了，但所需的颜色就少得多了。尝试使用尽可能少的颜色为下面的地图着色： 

    .four-colour-icons
      for i in [1, 2, 3, 4, 5, 6, 7]
        .four-colour-icon(tabindex=0)
    
    x-tabbox.four-colours.full-width
      .tab
        h3 United States #[span.check(when="map-0")]
        x-solved
        .colour-count(style="margin-bottom: -32px") #[span 0] colours used
        include svg/colours-1.svg
        button.btn.clear Clear
        // Note that states or countries which only share a corner are allowed to have the same colour.
        // Alaska and Hawaii are isolated from all of the other states and can have any colour.
      .tab
        h3 South America #[span.check(when="map-1")]
        x-solved
        .colour-count #[span 0] colours used
        include svg/colours-2.svg
        button.btn.clear Clear
      .tab
        h3 Germany #[span.check(when="map-2")]
        x-solved
        .colour-count #[span 0] colours used
        include svg/colours-3.svg
        button.btn.clear Clear
      .tab
        h3 England #[span.check(when="map-3")]
        x-solved
        .colour-count #[span 0] colours used
        include svg/colours-4.svg
        button.btn.clear Clear

---
> id: maps-2
> title: The Four Colour Theorem

::: column.grow

所有这些地图只能用四种不同的颜色进行着色，但是不难想象其他非常复杂的地图可能需要更多的颜色。实际上，每张地图包含四个相互连接的国家时__，至少__需要四种颜色。 

::: column(width=200)

    img(src="images/four-colours.png" width=200 height=120)

:::

像以前一样，我们可以将带有国家和边界的地图转换为平面图：每个国家都变成[[一个顶点|边缘|一张脸]]和[[共享边界的]]国家[[|具有相同颜色]]的边缘连接： 

    .svg-block: include svg/colour-graph.svg

{.reveal(when="blank-0 blank-1")}现在，我们要为图形的顶点着色，并且两个顶点通过边连接时必须具有不同的颜色。 

---
> id: maps-3

::: column(width=240 parent="right")

    x-img(lightbox width=240 height=320 src="images/england-counties.jpg")

::: column.grow

1852年，植物学专业的[弗朗西斯·古思里（Francis Guthrie）](bio:guthrie)必须为英格兰的县地图上色。他观察到四种颜色似乎足以满足他尝试的任何地图，但他无法找到适用于_所有_地图的证明。原来这是一个极其困难的问题，并被称为__四色定理__ 。 

在随后的100年中，许多数学家发布了四色定理的“证明”，只是为了以后发现错误。其中一些无效的证据令人信服，以至于花了10年多的时间才发现错误。 

长期以来，数学家无法证明四种颜色就够了，或者找不到需要四种以上颜色的地图。 

:::

---
> id: maps-4

直到1976年[沃尔夫冈·哈肯](bio:haken) （ [Wolfgang Haken）](bio:haken)和[肯尼斯·阿佩尔](bio:appel) （ [Kenneth Appel）](bio:appel)使用计算机最终解决该问题时，在四色问题上进展甚微。他们将无数种可能的地图缩减为1936种特殊情况，每种情况都由一台计算机进行了总计超过1000个小时的检查。 

    x-parallax.full-width(background="images/ibm-360.jpg")

---
> id: maps-5

四色定理是第一个使用计算机证明的著名数学定理，此后变得越来越普遍，争议也越来越小。更快的计算机和更高效的算法意味着今天您可以在几个小时内在笔记本电脑上证明四种颜色定理。 

    figure
      x-img(src="images/suffice.jpg" width=320 height=80 credit="http://www.math.illinois.edu/History/postmarks.pdf")
      p.caption Postmark for the Department of Mathematics at the University of<br/>Illinois Urbana-Champaign, where Haken and Appel worked.

---
> id: maps-6

::: column.grow

四色定理仅适用于平面或球体上的地图，并且所有国家/地区都由一个区域组成。 

但是，数学家们还查看了_帝国_地图（国家可以由多个相互独立的组成部分组成）以及不同形状的行星（如圆环（甜甜圈形状））上的地图。在这些情况下，您可能需要四种以上的颜色，并且校样变得更加困难。 

::: column(width=300)

    x-video(width=300 height=220 src="images/torus.mp4" hover loop)
    p.caption This map on a torus requires seven colours.

:::

---
> id: salesman
> section: travelling-salesman
> translated: auto

## 旅行商问题

::: column.grow(parent="right")

让我们再次考虑网络和地图。想象一下送货服务必须拜访${tsn}{tsn|8|2,50,1}在不同的城市分发包裹。我们可以将这些城市视为图中的顶点。如果所有城市都通过公路连接，则这是[[完整的图表|周期|二分图]] ，所以有<mfrac><mrow>${tsn} ×（ ${tsn} – 1）</mrow><mn>2</mn></mfrac> = ${tsn*(tsn-1)/2}总的边缘。 

送货卡车必须以任何顺序参观所有城市。在柯尼斯堡（Königsberg）桥梁问题中，我们希望找到沿_每_一条_边沿_精确地行进的路径。现在，我们想找到只访问_每个顶点_一次的路径。这些路径称为__哈密顿循环__ 。 

::: column(width=260)

    x-img(src="images/truck.jpg" width=260 height=280)

:::

---
> id: salesman-1

完整图中的哈密顿循环有无数种不同的可能性。实际上，我们可以选择任何一个顶点作为起始顶点，然后以任何顺序选择任何剩余的城市： 

    .row
      .grow: p.todo Diagram coming soon…
      .grow: p.todo Diagram Coming Soon…

---
> id: salesman-2

在图中${tsn1}{tsn1|4|2,10,1}城市，每个汉密尔顿周期也必须包含${tsn1}城市。现在， 

    ul.var(:html="tsmString(tsn1)")

这意味着总共有${tsnPaths(tsn1)}可能的路径。该产品的简称是${tsn1} ！要么${tsn1} __阶乘__ 。 

您可以想象，如果不经过另一个城市，可能无法直接在两个城市之间旅行。在那种情况下，我们将不再有完整的图，找到汉密尔顿循环的数量（如果根本存在）将变得更加困难。 

---
> id: salesman-3

::: column.grow(parent="right")

到目前为止，我们忽略了以下事实：有些城市可能比另一些城市更远。但是，在现实生活中，这是一个非常重要的考虑因素：我们不仅要找到_任何_一条路径，而且还要找到最短的路径。这称为__旅行商问题__ 。它不仅需要在运输和物流中解决，而且还必须在将晶体管放置在微芯片上，制造更快的计算机或分析[DNA](gloss:dna)结构时解决。 

一种简单的方法是尝试所有可能的路径，找到每个路径的长度，然后选择最短的路径。但是我们已经证明了，即使${tsn2}{tsn2|10|2,20,1}有的城市${tsn2} ！ = ${factorial(tsn2)}可能的路径。一旦拥有成百上千个顶点，即使使用功能强大的计算机，也无法尝试所有可能的路径。 

::: column(width=220)

    x-img(lightbox src="images/microchip.jpg" width=210 height=365)

:::

---
> id: salesman-4
> goals: move

不幸的是，没有更有效的算法来解决旅行商问题。取而代之的是，数学家和计算机科学家开发了各种算法，它们找到了_很好的_解决方案，即使它们可能不是最好的。这些仅给出近似解的算法称为__启发式算法__ 。 

尝试在地图上重新排列城市，并观察它们之间最短路径的变化。您可以通过点按来删除城市，也可以通过在地图上的任意位置（最多8个）单击来添加城市： 

    figure: .tsm
      svg(width=760 height=480 viewBox="0 0 760 480")

---
> id: salesman-5

::: column.grow

__贪婪算法__ （或最近邻居算法）非常简单：您从一个随机城市开始，然后连续移至您之前从未访问过的最近城市。一旦您访问了所有城市，便会停下来。 

::: column(width=300)

{.todo}动画即将推出… 

:::

您可以证明，使用贪婪算法找到的路径平均比最短路径长25％。 

---
> id: salesman-6

::: column.grow

__2-Opt算法__从可能的随机路径开始。然后，您反复选择两个边缘并交换它们，如果这样会减少路径的长度。当您无法通过交换任何对边来进一步减小长度时，您会停下来。 

::: column(width=300)

{.todo}动画即将推出… 

:::

---
> id: ants

事实证明，在计算机甚至还没有出现的很早以前，自然界就已经找到了一种巧妙的方法来找到不同位置之间的最佳路径：在蚁群中。 

    x-parallax.full-width(background="images/ants.jpg")

蚂蚁希望找到它们的巢和食物来源之间的最短路径。它们可以通过沿着行进路线留下的化学物质相互交流，并可以跟随其他蚂蚁。 

---
> id: ants-1

::: column.grow

*蚁群会发出许多侦察兵，这些侦察兵最初会朝随机方向行进。一旦找到食物，他们就会返回，留下一小撮信息素。 *其他蚂蚁在找到一条时往往会沿着一条小路前进，这会导致它们进食。在返回途中，他们会沉积更多的信息素，从而加强了踪迹。 *随着时间的流逝，信息素蒸发。路径越长，蚂蚁沿着它行进所花费的时间就越多，因此信息素有更多的时间蒸发。另一方面，短路径可以更快地得到增强，因此它们的强度会更快地增加。 

::: column(width=240)

{.todo}图即将推出… 

:::

---
> id: ants-2

::: column(width=220 parent="right")

    x-img(style="margin-top: 5px" src="images/ant.jpg" width=220 height=220)

::: column.grow

蚁群系统（ACS）算法尝试使用许多“虚拟”蚂蚁在计算机上复制此行为。他们可以迅速找到很好的解决旅行商问题的解决方案。 

ACS算法的一个特别有用的特性是，它们可以连续运行并实时适应图的变化。这些变化可能是由街道网络上的交通事故和道路封闭造成的，也可能是计算机网络上Web服务器的流量激增所致。 

:::

---
> id: ants-3

::: column(width=140)

    img(src="images/binary.jpg" width=140 height=320)

::: column.grow

旅行商问题是[NP难题](gloss:np) ，这意味着很难用计算机来解决（至少对于许多城市而言）。 

找到一种快速而精确的算法将对计算机科学领域产生严重的影响：这意味着对于_所有_ NP难题，都有快速的算法。这也将使大多数Internet安全无用，这取决于以下事实，即某些问题被认为对计算机来说非常困难。 

寻找一种解决旅行商问题的快速算法，也将解决数学和计算机科学中最著名的开放问题之一，即__P vs NP__问题。它是七个“ [千年奖”问题之一](gloss:millennium-prize) ，每个都有100万美元的奖金。 

:::

---
> section: scheduling
> sectionStatus: dev

## 安排问题

{.todo}快来了

---
> id: applications
> section: applications
> translated: auto

## 日常生活中的图表

在前几章中，我们已经看到了图论的许多不同应用，尽管其中有些是人为的。但是事实证明，图是日常生活中许多对象，概念和过程的基础。 

::: column.grow

例如，Internet是一个庞大的虚拟图。每个顶点都是一个单独的网页，每个边缘都意味着两个页面之间存在超链接。请注意，链接仅以一种方式进行，因此此图是有[[向的|多行|选择]] ，并且该图_非常非常大_ 。 

某些网站，例如Wikipedia或Facebook，具有很多传入链接，而许多较小的网站可能只有很少的传入链接。这是Google用于对搜索结果进行排序的基本概念。 

::: column(width=240)

    img(credit="© Various" src="images/websites.png" width=240 height=240)

:::

---
> id: applications-1

具有更多传入链接的网站往往质量更高，应显示在搜索结果的顶部。例如，当搜索“伦敦”时，会在伦敦的小商店或生活在伦敦的人们的博客之前显示官方的旅游信息网站。基于图论的简单想法，即__网页排名算法__ ，使Google明显优于其他早期搜索引擎。 

---
> id: applications-2

互联网是人类有史以来最大的网络。此图显示了连接到Internet的所有服务器的很小一部分： 

    x-parallax.full-width(background="images/internet.jpg")
      .credit © LyonLabs, LLC and Barrett Lyon, 2014

---
> id: applications-3

网站和超链接形成_虚拟_图形时，计算机，服务器，路由器，电话线和电缆也存在_物理_网络。 

::: column.grow(parent="right")

每次拨打电话或加载网站时，网络运营商都必须找到一种连接发送方和接收方的方法，而不会超出任何单独的电缆或连接的容量。图论和概率使保证可靠的服务成为可能，例如通过在特定连接繁忙时查找转移。 

::: column(width=220)

    x-img(lightbox src="images/phone.jpg" width=220 height=166)

:::

---
> id: applications-4

图在运输和导航中也起着重要作用。所有的航班，火车和地铁网络都形成图表，可在创建有效的时间表时使用。最可识别的图表之一是伦敦地铁地图： 

    figure: x-img(lightbox src="images/tube-map.png" width=720 height=480 credit="© Transport for London")

---
> id: applications-5

::: column.grow

所有道路和高速公路也形成了一个大型网络，当计算出两个给定点之间的最短路线时，诸如Google Maps这样的导航服务便会使用该网络。 

::: column(width=60)

    x-img(credit="© Google" src="images/google-maps.jpg" width=70 height=70)

:::

::: column(width=280)

    x-img(lightbox src="images/congestion.jpg" width=280 height=170)

::: column.grow

未来， __智能交通系统__将使用从智能手机和自动驾驶汽车收集的位置数据，通过更有效地安排汽车路线来减少拥堵和事故。这样可以每年节省数百万小时的行车时间，显着减少污染，并使紧急服务的行驶速度更快。 

:::

---
> id: applications-6

此图显示了横跨北欧的商业航空公司航班网络。 

    x-parallax.full-width(background="images/flights.jpg")

---
> id: applications-7

科学，工程或日常生活中还有无数其他图表： 

::: column(width=200)

    x-img(lightbox src="images/molecules.jpg" width=200 height=200)

{.caption} __分子中的__原子与晶格之间的链接形成一个图。 

::: column(width=200)

    x-img(lightbox src="images/epidemic.jpg" width=200 height=200)

{.caption}可以使用网络__对疾病__和流行病的__传播__进行建模。 

::: column(width=200)

    x-img(lightbox src="images/evolution.jpg" width=200 height=200)

{.caption}在生物学中，显示物种祖先的__进化树__形成图。 

::: column(width=200)

    x-img(lightbox src="images/network6.jpg" width=200 height=200)

{.caption} __电路__和计算机芯片的不同组件形成一个网络。 

::: column(width=200)

    x-img(lightbox src="images/letters.jpg" width=200 height=200)

{.caption} __语言__的语法结构可以使用图形建模，例如创建翻译算法。 

::: column(width=200)

    x-img(lightbox src="images/finance.jpg" width=200 height=200)

{.caption}图在__概率__ ， __博弈论__和__金融数学中__也有许多应用。 

:::

---
> id: social

### 社交网络

最后，让我们考虑一下日常生活中存在的图表的一个特别好的例子：社交媒体。在这里，顶点表示[[人|朋友们|网络]]和边缘代表友谊，喜欢，订阅或关注者。 

当我们绘制社交媒体图时，我们可能会看到某些共同的朋友__群__ ，他们可能去过同一所学校或住在同一座城市。我们还可以确定人们的__中心性__ ，这取决于顶点的连接程度，并且可以衡量一个人在社交媒体上的受欢迎程度。 

    figure: x-img(lightbox src="images/social-network.png" width=720 height=500)

---
> id: social-1

::: column.grow

2014年，Facebook拥有14亿活跃用户，总计超过2000亿友谊。所有Facebook用户中有一半拥有200多个朋友，并且由于我们的大多数朋友都有相似数量的朋友，因此我们很容易拥有成千上万_的朋友_ 。 

现在，一个令人兴奋的问题是：如果您选择任意两个Facebook用户，则需要遵循多少“友谊优势”？例如，朋友之间的距离是[[1]] ，朋友之间的距离是[[2]] ，依此类推。 

::: column(width=200)

    x-img(src="images/facebook-like.png" width=200 height=200)

:::

---
> id: social-2

2016年，Facebook进行[了一项研究，](https://research.facebook.com/blog/three-and-a-half-degrees-of-separation/)以确定其用户如何相互连接。他们发现，平均而言，您最多通过3.57个其他人与Facebook上的_任何_其他人建立联系。其中包括名人，政客甚至皇室！ 

换句话说，如果您选择全世界数十亿Facebook用户中的任何一个，则他们可能会有一个朋友的朋友，而该朋友认识您其中一个朋友的朋友。我们说有3.57 __度的分离度__ 。 

    figure
      x-img(lightbox src="images/facebook.jpg" width=720 height=360 credit="© Facebook")
      p.caption Geographic visualisation of all Facebook friendships in 2010.

---
> id: social-3

::: column(width=200)

    x-img(credit="© Metro-Goldwyn-Mayer" src="images/six-degrees.jpg" width=200 height=265 style="border: 1px solid #ccc")

::: column.grow

1929年，匈牙利作家[Frigyes Karinthy](bio:karinthy)首次提出“六度分离”的想法时，没有互联网或社交媒体，但是世界已经开始变得更加互联。 

1967年， [斯坦利·米尔格拉姆](bio:milgram) （ [Stanley Milgram）](bio:milgram)进行了首次实证实验，其中邀请了296位居住在内布拉斯加州和堪萨斯州的参与者向居住在马萨诸塞州波士顿的特定人士致函。他们都必须选择一个朋友来寄信，然后由他选择另一个朋友。在每一步中，这封信都靠近波士顿。米尔格拉姆发现，平均而言，只有5.2个中间朋友–分离度为5.2度。 

:::

如今，我们每个人都是无数无形图的一部分，这些图构成了我们的社会互动，旅行，互联网和技术，科学等等的基础。
