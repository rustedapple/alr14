"use strict";

var Story = {
   "createDefaultStory" : function () {
      var story = Story.createStory();
      story.pages[0] = Story.createPage("Would you like to write a short story or a long story?");
      story.pages[0].choices = [
         Story.createChoice("A short story please!"),
         Story.createChoice("Are you kidding me? I am pro. I am writing a NOVEL."),
      ];
   },
   "createStory" : function () {
      return {
         "pages" : [],
         "currentPage" : -1,
         "render" : function () {

         }
      }
   },
   "createPage" : function (text) {
      if (text === undefined)
         text = "";
      
      return {
         "text" : "",
         "choices" : []
      }
   },
   "createChoice" : function (text) {
      if (text === undefined)
         text = "";
      
      return {
         "text" : text,
         "page" : null
      }
   }
}
