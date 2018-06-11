export const helpText =
`BBCode or Bulletin Board Code is a lightweight markup language used to format posts in many message boards.The available tags are usually indicated by square brackets ([lsb] [rsb]) surrounding a keyword, and they are parsed by the message board system before being translated into a markup language that web browsers understand.Read more about BBCode at [url=https://wikipedia.org/wiki/BBCode]Wikipedia[/url].
[hr]
Trying to render square brackets that are not a part of a tag is difficult with the current parser that we are using. To make it easier, you can use dedicated [code=inline][lsb][/code] and [code=inline][rsb][/code] tags.
Each section will be seperated with a horizontal rule by using the [code=inline][hr][/code] tag.
Most BBCode tags will require an end tag, but the [code=inline][lsb], [rsb], and [hr][/code] tags do not require end tags since they have no inner content.
[hr]
[lsb]h1[rsb]Header 1[lsb]/h1[rsb]
[h1]Header 1[/h1]
[lsb]h2[rsb]Header 2[lsb]/h2[rsb]
[h2]Header 2[/h2]
[lsb]h3[rsb]Header 3[lsb]/h3[rsb]
[h3]Header 3[/h3]
[lsb]h4[rsb]Header 4[lsb]/h4[rsb]
[h4]Header 4[/h4]
[lsb]h5[rsb]Header 5[lsb]/h5[rsb]
[h5]Header 5[/h5]
[lsb]h6[rsb]Header 6[lsb]/h6[rsb]
[h6]Header 6[/h6]
[hr]
[lsb]hide[rsb]You can hide text that will be readable on mouse hover[lsb]/hide[rsb]

[hide]You can hide text that will be readable on mouse hover[/hide]
[hr]
[lsb]b[rsb]Bold[lsb]/b[rsb]
   [b]Bold[/b]
[lsb]i[rsb]Italic[lsb]/i[rsb]
   [i]Italic[/i]
[lsb]u[rsb]Underline[lsb]/u[rsb]
   [u]Underline[/u]
[lsb]s[rsb]Strikethrough[lsb]/s[rsb]
   [s]Strikethrough[/s]
[lsb]size=32[rsb]Text size in pixels[lsb]/size[rsb]
   [size=32]Text size in pixels[/size]
[lsb]color=red[rsb]Text color[lsb]/color[rsb]
   [color=red]Text color[/color]
[lsb]color=#000000[rsb]Text color[lsb]/color[rsb]
   [color=#000000]Text color[/color]
[lsb]size=24[rsb][color=red[rsb][b[rsb]Combined text[lsb]/b[rsb][lsb]/color[rsb][lsb]/size[rsb]

[size=24][color=red][b]Combined text[/b][/color][/size]
[lsb]center[rsb]Align center[lsb]/center[rsb]
[center]Align center[/center]
[lsb]right[rsb]Align right[lsb]/right[rsb]
[right]Align right[/right]
[hr]
[lsb]url[rsb]https://example.com[lsb]/url[rsb]
   [url]https://example.com[/url]
[lsb]url=https://example.com[rsb]Link[lsb]/url[rsb]
   [url=https://example.com]Link[/url]
[email]my.email@domain.com[/email]
   [lsb]email[rsb]my.email@domain.com[lsb]/email[rsb]
[hr]
[lsb]img width="150" height="100"[rsb]https://img00.deviantart.net/0687/i/2011/340/3/6/bear_dragon_by_zombiegnu-d4idhlo.png[lsb]/img[rsb][lsb]/url[rsb]

[img width="150" height="100"]https://img00.deviantart.net/0687/i/2011/340/3/6/bear_dragon_by_zombiegnu-d4idhlo.png[/img]
[lsb]img[rsb]https://img00.deviantart.net/0687/i/2011/340/3/6/bear_dragon_by_zombiegnu-d4idhlo.png[lsb]/img[rsb]

[img]https://img00.deviantart.net/0687/i/2011/340/3/6/bear_dragon_by_zombiegnu-d4idhlo.png[/img]
[hr]
[lsb]quote[rsb]Quote[lsb]/quote[rsb]
[quote]Quote[/quote]
[lsb]quote="Mr. Blobby"[rsb]The text Mr. Blobby wrote would go here[lsb]/quote[rsb]
[quote="Mr. Blobby"]The text Mr. Blobby wrote would go here[/quote]
[hr]
[lsb]code[rsb]Code[lsb]/code[rsb]
[code]Code[/code]
[lsb]code[rsb][lsb]b[rsb]strong[lsb]/b[rsb][lsb]/code[rsb]
[code][b]strong[/b][/code]
[lsb]code=inline[rsb]
   [lsb]b[rsb]strong[lsb]/b[rsb][lsb]/code[rsb]
[code=inline][b]strong[/b][/code]
[hr]
[lsb]pre[rsb]Hello,  I  am  a  sentence  constructed  entirely  from  preformatted  text.

   Look,

      I

         see

            a

            boat![lsb]/pre[rsb]
[pre]Hello,  I  am  a  sentence  constructed  entirely  from  preformatted  text.

   Look,

      I

         see

            a

               boat![/pre]
[hr]
[lsb]list[rsb]
[lsb]*[rsb]The first possible answer
[lsb]*[rsb]The second possible answer
[lsb]*[rsb]The third possible answer
[lsb]/list[rsb]
[list]
[*]The first possible answer
[*]The second possible answer
[*]The third possible answer
[/list]

[lsb]list=a[rsb]
[lsb]*[rsb]The first possible answer
[lsb]*[rsb]The second possible answer
[lsb]*[rsb]The third possible answer
[lsb]/list[rsb]
[list=a]
[*]The first possible answer
[*]The second possible answer
[*]The third possible answer
[/list]

[lsb]list=A[rsb]
[lsb]*[rsb]The first possible answer
[lsb]*[rsb]The second possible answer
[lsb]*[rsb]The third possible answer
[lsb]/list[rsb]
[list=A]
[*]The first possible answer
[*]The second possible answer
[*]The third possible answer
[/list]

[lsb]list=i[rsb]
[lsb]*[rsb]The first possible answer
[lsb]*[rsb]The second possible answer
[lsb]*[rsb]The third possible answer
[lsb]/list[rsb]
[list=i]
[*]The first possible answer
[*]The second possible answer
[*]The third possible answer
[/list]

[lsb]list=I[rsb]
[lsb]*[rsb]The first possible answer
[lsb]*[rsb]The second possible answer
[lsb]*[rsb]The third possible answer
[lsb]/list[rsb]
[list=I]
[*]The first possible answer
[*]The second possible answer
[*]The third possible answer
[/list]

[lsb]list=1[rsb]
[lsb]*[rsb]The first possible answer
[lsb]*[rsb]The second possible answer
[lsb]*[rsb]The third possible answer
[lsb]/list[rsb]
[list=1]
[*]The first possible answer
[*]The second possible answer
[*]The third possible answer
[/list]
[hr]
[lsb]table[rsb]

  [lsb]thead[rsb]

    [lsb]th[rsb]first column       [lsb]/th[rsb]

    [lsb]th[rsb]second column[lsb]/th[rsb]

  [lsb]/thead[rsb]

  [lsb]tbody[rsb]

    [lsb]tr[rsb]

      [lsb]td[rsb]1.1[lsb]/td[rsb]

      [lsb]td[rsb]1.2[lsb]/td[rsb]

    [lsb]/tr[rsb]

  [lsb]/tbody[rsb]

[lsb]/table[rsb]
[table]
  [thead]
    [th]first column       [/th]
    [th]second column[/th]
  [/thead]
  [tbody]
    [tr]
      [td]1.1[/td]
      [td]1.2[/td]
    [/tr]
  [/tbody]
[/table]
`;