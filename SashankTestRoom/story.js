"use strict";

$(document).ready(function() {
   $("#pageTextArea").on('change keyup paste', function () {
      if (gStory) {
         if (0 <= gStory.currentPageIndex && gStory.currentPageIndex < gStory.pages.length) {
            var page = gStory.pages[gStory.currentPageIndex];
            page.text = $("#pageTextArea").val();
         }
      }
   });
});

var gStory;
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
      }
   },
   "createPage" : function (text) {
      if (text === undefined)
         text = "";
      
      return {
         "text" : text,
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

var Renderer = {
   "renderStory" : function (story) {
      if (story) {
         if (0 <= story.currentPageIndex && story.currentPageIndex < story.pages.length) {
            var page = story.pages[story.currentPageIndex];
            Renderer.renderPage(page);
         }
      }
   },
   "renderPage" : function (page) {
      $("#pageTextArea").val(page.text);
      $("#choicesWrapper").empty();
      for (var i = 0; i < page.choices.length; i++) {
         var choice = page.choices[i];
         var htmlText = Renderer.createChoiceHtml(choice);
         $("#choicesWrapper").append(htmlText);
      }
   },
   "createChoiceHtml" : function (choice) {
      return '<div id="choice1"> \
         <Button type="button" onclick="">' + choice.text + '</Button> \
         <Button type="button" onclick="">(X)</Button> \
      </div>';
   }
}

var Load_Click = function () {
   var story = JSON.parse(localStorage.getItem('story'));
   if (story) {
      gStory = story;
   }
   if (gStory == null) {
      gStory = Story.createDefaultStory();
   }
   Renderer.renderStory(gStory);
};

var Save_Click = function () {
   localStorage.setItem('story', JSON.stringify(gStory));
};
