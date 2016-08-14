"use strict";

var Story = {
   "createDefaultStory" : function () {
      var story = Story.createStory();
      story.pages[0] = Story.createPage("Would you like to write a short story or a long story?");
      story.pages[0].choices = [
         Story.createChoice("A short story please!"),
         Story.createChoice("Are you kidding me? I am pro. I am writing a NOVEL."),
      ];
      story.currentPageIndex = 0;
      return story;
   },
   "createStory" : function () {
      return {
         "pages" : [],
         "currentPageIndex" : -1,
         "render" : function () {
            if (0 <= this.currentPageIndex && this.currentPageIndex < this.pages.length) {
               var page = this.pages[this.currentPageIndex];
               page.render();
            }
         }
      }
   },
   "createPage" : function (text) {
      if (text === undefined)
         text = "";
      
      return {
         "text" : text,
         "choices" : [],
         "render" : function () {
            $("pageTextArea").val(text);
            $("choicesWrapper").innerHTML = "";
            for (var i = 0; i < this.choices.length; i++) {
               var choice = this.choices[i];
               var htmlText = choice.createHtml();
               $("choicesWrapper").append(htmlText);
            }
         }
      }
   },
   "createChoice" : function (text) {
      if (text === undefined)
         text = "";
      
      return {
         "text" : text,
         "page" : null,
         "createHtml" : function () {
            return '<div id="choice1"> \
               <Button type="button" onclick="">' + text + '</Button> \
               <Button type="button" onclick="">(X)</Button> \
            </div>';
         }
      }
   }
}

var Load_Click = function ()
{
   var defaultStory = Story.createDefaultStory();
   defaultStory.render();
}

