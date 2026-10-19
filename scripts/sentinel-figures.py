"""Create self-contained SVG images from the approved HTML sources, without a browser."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
import base64, json, re
ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Element:
    def __init__(self, tag, attrs=()): self.tag, self.attrs, self.children = tag, dict(attrs), []
class Parser(HTMLParser):
    def __init__(self): super().__init__(convert_charrefs=True); self.root=Element('root'); self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        node=Element(tag,attrs); self.stack[-1].children.append(node)
        if tag not in VOID: self.stack.append(node)
    def handle_startendtag(self,tag,attrs): self.handle_starttag(tag,attrs); self.handle_endtag(tag)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag: self.stack=self.stack[:i]; break
    def handle_data(self,text): self.stack[-1].children.append(text)
def nodes(node):
    if isinstance(node,Element):
        yield node
        for child in node.children: yield from nodes(child)
def serialize(node):
    if isinstance(node,str): return escape(node,quote=False)
    attrs=dict(node.attrs)
    if node.tag=='svg':
        # HTMLParser lowercases attributes; SVG in XML requires viewBox's original case.
        if 'viewbox' in attrs: attrs['viewBox']=attrs.pop('viewbox')
        attrs['xmlns']='http://www.w3.org/2000/svg'
    attrs=''.join(' '+key+'="'+escape(value or '',quote=True)+'"' for key,value in attrs.items())
    if node.tag in VOID:return '<'+node.tag+attrs+' />'
    return '<'+node.tag+attrs+'>'+''.join(serialize(child) for child in node.children)+'</'+node.tag+'>'
fonts=[]
for family,package,weight in [('Inter','inter',400),('Inter','inter',500),('Inter','inter',600),('Roboto Mono','roboto-mono',400),('Roboto Mono','roboto-mono',500)]:
    file=ROOT/'node_modules/@fontsource'/package/'files'/f'{package}-latin-{weight}-normal.woff2'
    fonts.append('@font-face{font-family:"'+family+'";font-style:normal;font-weight:'+str(weight)+';src:url(data:font/woff2;base64,'+base64.b64encode(file.read_bytes()).decode()+') format("woff2")}')
layouts=json.loads((ROOT/'sentinel-handoff/prototype/data/layouts.json').read_text())
for file in (ROOT/'sentinel-handoff/reference/screens').glob('*.html'):
    if file.stem=='index':continue
    parser=Parser();parser.feed(file.read_text());body=next(n for n in nodes(parser.root) if n.tag=='body')
    if file.stem=='Main':
        cards=[n for n in nodes(body) if n.tag=='a' and n.attrs.get('href')=='Picker.html' and 'flex-direction: column' in n.attrs.get('style','')]
        configs=[*layouts['library'],None,*layouts['saved']]
        for card,config in zip(cards,configs):
            if not config:continue
            well=next(n for n in card.children if isinstance(n,Element))
            well.attrs['style']=re.sub(r'grid-template-rows: repeat\(6, 1fr\)', 'grid-template-rows: repeat(10, minmax(0, 1fr))',well.attrs['style'])
            well.children=[Element('span',[('style',f'grid-column:{w["x"]+1}/span {w["w"]};grid-row:{w["y"]+1}/span {w["h"]};background:#1c2632;border:1px solid #27333f;border-radius:2px')]) for w in config['widgets']]
            for node in nodes(card):
                node.children=[re.sub(r'\d+ widgets',f'{len(config["widgets"])} widgets',c) if isinstance(c,str) else c for c in node.children]
    height=1040 if file.stem=='Maintainer' else 900
    children=''.join(serialize(child) for child in body.children)
    css=''.join(fonts)+'*{font-synthesis:none}body{margin:0}a{text-decoration:none}button,input,select{pointer-events:none}'
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="{height}" viewBox="0 0 1440 {height}"><foreignObject width="1440" height="{height}"><div xmlns="http://www.w3.org/1999/xhtml"><style>{escape(css,quote=False)}</style>{children}</div></foreignObject></svg>'
    (ROOT/'public/sentinel'/f'{file.stem}.svg').write_text(svg)
print('Prepared 13 self-contained Sentinel figures.')
