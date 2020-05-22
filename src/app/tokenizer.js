const tokenizer = {
  space(src) {
    return false;
  },

  code(src, tokens) {
    return false;
  }
  ,
  fences(src) {
    return false;
  }
  ,
  heading(src) {
    return false;
  }
  ,
  nptable(src) {
    return false;
  }
  ,
  hr(src) {
    return false;
  }
  ,
  blockquote(src) {
    return false;
  }
  ,
  list(src) {
    return false;
  }
  ,
  html(src) {
    return false;
  }
  ,
  def(src) {
    return false;
  }
  ,
  table(src) {
    return false;
  }
  ,
  lheading(src) {
    return false;
  }
  ,
  paragraph(src) {
    return false;
  }
  ,
  text(src, tokens) {
    return false;
  }
  ,
  escape(src) {
    return false;
  }
  ,
  tag(src, inLink, inRawBlock) {
    return false;
  }
  ,
  link(src) {
    const match = src.match(/^\[\[(\w)+\]\]$/)
    console.log('called')

    if (match) {
      return {
        href: "",
        title: match[0],
        text: match[1].trim()
      }
    }
    console.log('didnt match')
    return false;
  }
  ,
  reflink(src, links) {
    return false;
  }
  ,
  strong(src) {
    return false;
  }
  ,
  em(src) {
    return false;
  }
  ,
  codespan(src) {
    return false;
  }
  ,
  br(src) {
    return false;
  }
  ,
  del(src) {
    return false;
  }
  ,
  autolink(src, mangle) {
    return false;
  }
  ,
  url(src, mangle) {
    return false;
  }
  ,
  inlineText(src, inRawBlock, smartypants) {
    return false;
  }
}

module.exports = tokenizer;
