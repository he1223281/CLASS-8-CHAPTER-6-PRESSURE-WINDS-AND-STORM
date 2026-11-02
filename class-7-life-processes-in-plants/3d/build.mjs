import {build} from 'esbuild';import fs from 'fs';
const r=await build({entryPoints:['src/main.js'],bundle:true,minify:process.env.DBG?false:true,format:'iife',write:false,target:'es2020',legalComments:'none'});
const js=r.outputFiles[0].text.replace(/<\/script/g,'<\\/script');
const html=`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Life Processes in Plants · Grade 7 Science</title>\n<style>${fs.readFileSync('src/style.css','utf8')}</style>\n</head>\n<body>\n${fs.readFileSync('src/shell.html','utf8')}\n<script>${js}</script>\n</body>\n</html>\n`;
fs.writeFileSync(process.argv[2]||'out.html',html);console.log('built',(html.length/1024).toFixed(0),'KB');
