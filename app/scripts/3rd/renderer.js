function markdownItFactory(markdownIt) {
  var md = markdownIt('default', {});
  return md;
}

function markdownToPdfmake(markdown){
  if (markdown===undefined){
    return ' ';
  }
  else {
    var constructor = window.markdownit || markdownit;
    var md = markdownItFactory(constructor);
    //console.log(md.parse(markdown));
    return render(md.parse(markdown));
  }
}

function render (tokens) {
  var result = [];

  for (var i = 0; i < tokens.length; i++) {
    const currentToken = tokens[i];
    var subSection;

    switch (currentToken.type) {
      case 'bullet_list_open':
        subSection = selectUntilClosingTag(i, 'bullet_list_close', tokens);
        result.push({ul: render(subSection.tokens)});
        i=(subSection.jumpToIndex-1);
        break;
      case 'inline':
        result.push(renderInline(currentToken.children));
        break;
      default:
    }
  }
  return result
}

function renderInline (tokens) {
  var result = [];

  for (var i = 0; i < tokens.length; i++) {
    const currentToken = tokens[i];
    var subSection;

    switch (currentToken.type) {
      case 'em_open':
        subSection = selectUntilClosingTag(i, 'em_close', tokens);
        result.push({ text: renderInline(subSection.tokens), italics: true });
        i=(subSection.jumpToIndex-1);
        break;
      case 'strong_open':
        subSection = selectUntilClosingTag(i, 'strong_close', tokens);
        result.push({ text: renderInline(subSection.tokens), bold: true });
        i=(subSection.jumpToIndex-1);
        break;
      case 'text':
        result.push(currentToken.content);
        break;
      default:
    }
  }
  return result;
}

function selectUntilClosingTag (startIndex, closingTag, tokens) {
  var resultTokens = [];

  for (var i = startIndex + 1; i < tokens.length; i++) {
    const currentToken = tokens[i];

    if (currentToken.type === closingTag) {
      return {
        tokens: resultTokens,
        jumpToIndex: i + 1
      }
    } else {
      resultTokens.push(currentToken);
    }
  }
}
