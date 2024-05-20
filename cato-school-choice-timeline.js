async function create_sct() {
    //local
    // import {csv} from "https://cdn.skypack.dev/d3-fetch@3";
    // var csv_data = await csv("./data/school_choice_timeline_data.csv");

    //server
    var csv_data = await d3.csv("..\/..\/sites\/cato.org\/files\/school-choice-timeline\/data\/(2023-09-11)_school_choice_timeline_data.csv");
    console.log('data updated on September 11, 2023')

// console.log(csv_data);

// script for the timeline visualization: adds data, creates the timeline
// DOM element where the Timeline will be attached
    var container = document.getElementById("timeline_viz");
    var currentTimelineItemIndex = 0;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    console.log(today);

// read in the data
// order data by start date

// var data = $.csv.toObjects("ID","iManufacturer","iMPartNumber","iSimCategory","iPartType","iGroup","iLocation");
// console.log(data);

//local
// let timeline_image_path = ".\/images\/small\/"
// //server
    let timeline_image_path = "..\/sites\/cato.org\/files\/school-choice-timeline\/images\/small\/"


    for (var i = 0; i < csv_data.length; i++) {
        csv_data[i].id = +csv_data[i].id;
        // csv_data[i].style = "background-image: url(\""+timeline_image_path + csv_data[i].file_name +"\");";
        csv_data[i].className = "circle"
        // csv_data[i].start = csv_data[i].year+"-01-01";
        csv_data[i].start = csv_data[i].date;
        if(csv_data[i].source_2==""){
            csv_data[i].text = csv_data[i].text + "<br><br><strong>Source: </strong>"+csv_data[i].source_1.split(">")[0]+" target=\"_blank\""+csv_data[i].source_1.substring(csv_data[i].source_1.indexOf(">"));
        }else{
            csv_data[i].text = csv_data[i].text + "<br><br><strong>Sources: </strong>"+csv_data[i].source_1.split(">")[0]+" target=\"_blank\""+csv_data[i].source_1.substring(csv_data[i].source_1.indexOf(">"))+
                "; " +csv_data[i].source_2.split(">")[0]+" target=\"_blank\""+csv_data[i].source_2.substring(csv_data[i].source_2.indexOf(">"));
        }
        // csv_data[i].content = `<div class="timeline-item-container">`+
        //                             '<div class=\"timeline-item-year\">17.83</div>'+
        //                             '<div class=\"timeline-item-title\">Georgia</div>'+
        //                             '<div class="timeline-item-text">In 1783, the Georgia legislature authorized the governor to grant 1,000 acres of land to any 17 person authorized by a county for the erection of a...</div>'+
        //                             '<div class="timeline-item-readmore">Read More</div>'+
        //                       '</div>';
        var timeline_item_container = document.createElement('div');
        timeline_item_container.className = "timeline_item_container";
        var timeline_item_year = document.createElement('div');
        timeline_item_year.className = "timeline_item_year";
        timeline_item_year.textContent = csv_data[i].title_year;
        timeline_item_container.appendChild(timeline_item_year);
        var timeline_item_title = document.createElement('div');
        timeline_item_title.className = "timeline_item_title";
        timeline_item_title.innerHTML = csv_data[i].title;
        timeline_item_container.appendChild(timeline_item_title);

        var timeline_item_text = document.createElement('div');
        timeline_item_text.className = "timeline_item_text";
        timeline_item_text.innerHTML = csv_data[i].text;
        timeline_item_container.appendChild(timeline_item_text);

        csv_data[i].content = timeline_item_container;

        if(csv_data[i].descriptive_title!=""){
            csv_data[i].title = csv_data[i].descriptive_title;
        }
        var media_url = timeline_image_path + csv_data[i].file_name.slice(0,-4)+ "_small.jpg";
        csv_data[i].style = "background-image: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.7)),url("+media_url+");"
    }
    console.log(csv_data);

    var items = new vis.DataSet(csv_data);
    var lastTimelineItemIndex = items.length - 1;

// let zoom_min_in_ms = 1000*3600*24*365*25; /*1000ms*3600s*24h*365d*25*/
    let zoom_min_in_ms = 1000*3600*24*365*30; /*1000ms*3600s*24h*365d*25*/
    let zoom_max_in_ms = 1000*3600*24*365*60; /*1000ms*3600s*24h*365d*25y*/

// let start_date = "1870-01-01";
    let start_date = "1780-01-01";
// let end_date = "2050-01-01";
    let end_date = "1790-01-01";

// Configuration for the Timeline
    let zoomableSetting = false;
// console.log(document.body.clientWidth)
// if(document.body.clientWidth<1200) {
//   zoomableSetting=true;
// }

    var options = {
        // align: 'left',
        autoResize: true,
        // height: '800px',
        stack: false,
        // cluster:true,
        // minHeight: '800px',
        // maxHeight: '800px',

        minHeight: '300px',
        maxHeight: '400px',

        showTooltips: true,
        showMinorLabels:true,
        showMajorLabels:false,
        tooltip:{
            delay:10,
            followMouse:true,
            overflowMethod:'cap'
        },
        format:{
            minorLabels: {
                year:       'YYYY'
            },
            majorLabels: {
                year:       'YYYY'
            }
        },
        // rollingMode:{
        //   follow:true,
        //   offset:0.81
        // },
        align:'center',
        // maxMinorChars:6,
        maxMinorChars:10,
        showCurrentTime:true,
        // min: "1820-01-01",
        min: "1700-01-01",
        // max: "2100-01-01",
        max: "2150-01-01",
        // make start & end dynamic based on width of the document
        start: start_date,
        end: end_date,
        /* zoomMax:XXXXXXX, */
        // zoomMin: zoom_min_in_ms,
        // zoomMax: zoom_max_in_ms,
        clickToUse: false,
        zoomable: zoomableSetting
    };


// Create a Timeline
    var timeline = new vis.Timeline(container, items, options);
//
// // // timeline.on("select", function (properties) {
// timeline.on("select", function () {
//   // logEvent("select", properties);
//   var selection = timeline.getSelection();
//   // timeline.focus(selection);
// });

    function move(percentage) {
        var range = timeline.getWindow();
        var interval = range.end - range.start;

        timeline.setWindow({
            start: range.start.valueOf() - interval * percentage,
            end: range.end.valueOf() - interval * percentage,
        });
    }

    function custom_fit_timeline(width) {
        if(width < 1200){
            //there are a total of 120 years covered, for <1200px its best to show only these 120 years
            // timeline.redraw();
            timeline.fit();
        } else {

            //if there is more screen real estate, more years will be shown while keeping 120 years to 1200px at the center
            //appending 1 year for every 10 pixel on either end, so divide by 2 and then 10:
            var no_of_years_to_append_to_each_end = Math.floor(((width - 1200)/2)/10);
            //following code assumes there are no February 29 in the dataset,
            //a better way would be to use "date.setMonth(date.getMonth() – 12);"
            var custom_start_date = new Date(start_date);
            custom_start_date.setFullYear(custom_start_date.getFullYear()-no_of_years_to_append_to_each_end);
            var custom_end_date = new Date(end_date);
            custom_end_date.setFullYear(custom_end_date.getFullYear()+no_of_years_to_append_to_each_end);
            timeline.setWindow( custom_start_date, custom_end_date);

        }
    }

    function adjust_navigation_opacity(selected_item_index) {
        if(selected_item_index==0){
            console.log('we are at the first item');
            document.getElementById('zoomIn').className = 'inactive_btn gprev';
            document.getElementById('moveLeft').className = 'inactive_btn gprev';
        }
        else if(selected_item_index==lastTimelineItemIndex){
            console.log('we are at the last item');
            document.getElementById('zoomOut').className = 'inactive_btn gnext';
            document.getElementById('moveRight').className = 'inactive_btn gnext';
        }
        else{
            document.getElementById('zoomIn').className = 'active_btn gprev';
            document.getElementById('moveLeft').className = 'active_btn gprev';
            document.getElementById('zoomOut').className = 'active_btn gnext';
            document.getElementById('moveRight').className = 'active_btn gnext';
        }


    }

    function change_selected_timeline_item(selected_item) {
        timeline.redraw();
        console.log(selected_item);
        timeline.setSelection(selected_item);
        timeline.focus(selected_item,{zoom:false});
        timeline.redraw();
        adjust_navigation_opacity(selected_item);
    }

// attach events to the navigation buttons
    document.getElementById("zoomIn").onclick = function () {
        currentTimelineItemIndex = 0;
        change_selected_timeline_item(currentTimelineItemIndex);
    };
    document.getElementById("zoomOut").onclick = function () {
        currentTimelineItemIndex = lastTimelineItemIndex;
        change_selected_timeline_item(currentTimelineItemIndex);
    };
    document.getElementById("moveLeft").onclick = function () {
        if(currentTimelineItemIndex>0){
            currentTimelineItemIndex = currentTimelineItemIndex - 1;
            change_selected_timeline_item(currentTimelineItemIndex);
        }
    };
    document.getElementById("moveRight").onclick = function () {
        if(currentTimelineItemIndex<lastTimelineItemIndex){
            currentTimelineItemIndex = currentTimelineItemIndex + 1;
            change_selected_timeline_item(currentTimelineItemIndex);
        }
    };

    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;
        if (e.keyCode == '37') {
            if(currentTimelineItemIndex>0){
                currentTimelineItemIndex = currentTimelineItemIndex - 1;
                change_selected_timeline_item(currentTimelineItemIndex);
            }
        }
        else if (e.keyCode == '39') {
            if(currentTimelineItemIndex<lastTimelineItemIndex){
                currentTimelineItemIndex = currentTimelineItemIndex + 1;
                change_selected_timeline_item(currentTimelineItemIndex);
            }
        }
    }
//disabling the default action of the browser for the left/right arrow keys
    window.addEventListener("keydown", function(e) {
        if(["ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);






    let customSlideHTML = `<div class="gslide">
            <div class="gslide-media">
            </div>
</div>`;




    function create_slide_content(date, media_url, mediadesc, title, text, readmore){
        if(readmore==""){
            return `<div class="ginner-container">
              <div class="lb_infocard">
                  <div class="lb_infocard_container">
                      <div class="lb_infocard_date">${date}</div>
                      <div class="lb_infocard_dateline"></div>
                      <div class="lb_infocard_mediacontainer">
                          <div class="lb_infocard_media" style="background-image: url(${media_url})">
                              <img src="${media_url}" style="visibility: hidden; width: 100%" />
                          </div>
                          <div class="lb_infocard_mediadesc">${mediadesc}</div>
                      </div>
                      <div class="lb_infocard_textcontainer">
                          <div class="lb_infocard_title">${title}</div>
                          <div class="lb_infocard_text">${text}</div>
                      </div>
                  </div>
              </div>
            </div>`
        }
        else {
            return `<div class="ginner-container">
            <div class="lb_infocard">
                <div class="lb_infocard_container">
                    <div class="lb_infocard_date">${date}</div>
                    <div class="lb_infocard_dateline"></div>
                    <div class="lb_infocard_mediacontainer">
                        <div class="lb_infocard_media" style="background-image: url(${media_url})">
                            <img src="${media_url}" style="visibility: hidden; width: 100%" />
                        </div>
                        <div class="lb_infocard_mediadesc">${mediadesc}</div>
                    </div>
                    <div class="lb_infocard_textcontainer">
                        <div class="lb_infocard_title">${title}</div>
                        <div class="lb_infocard_text">${text}</div>
                        <a href="${readmore}" target="_blank"><div class="lb_infocard_readmore btn--forward-arrow btn default">Read more</div></a>
                    </div>
                </div>
              </div>
</div>`
        }
    };



    var slide_list =[];

// console.log(all_data.slice(0,56));
    csv_data.slice(0,csv_data.length).forEach(function(item){
        // var [date, title] = item.title.split(": ");
        var title = item.title;
        // var date = item.start.split("-")[0];
        var date = item.title_year;
        var media_url = timeline_image_path + item.file_name.slice(0,-4)+ "_small.jpg";
        // var media_url = item.style.split("\"")[1].replace(" ","\\ ");
        console.log(media_url)
        var mediadesc = item.mediadesc;
        var text = item.text;
        // var mediadesc = 'Attorney General <a href="http://www.loc.gov/item/2001704024/">Charles Bonaparte</a>'
        // var text = "On July 26, 1908 at the direction of then-Attorney General Charles Bonaparte, the Bureau of Investigation is <a href=\"https://www.fbi.gov/about-us/history/brief-history\" target=\"_blank\">created</a> within the Department of Justice, initially without formal statutory authorization from Congress (subsequently renamed Federal Bureau of Investigation in 1935). In November 1908, at the request of the Colombian government via the State Department, the BoI <a href=\"http://www.cato.org/sites/cato.org/files/timeline/documents/BoI%20Memo%20RG65%20M1085%20Reel%20112.pdf\" target=\"_blank\">investigated</a> a <i>Boston Post</i> story about a group of Americans allegedly violating U.S. neutrality laws. The BoI interrogated the reporter and his source but no charges were filed. Investigating constitutionally protected free speech activities would become a BoI/FBI hallmark in the decades that followed.";
        // if(readmore=""):
        var readmore= item.read_more_link;
        slide_list.push({content:create_slide_content(date, media_url, mediadesc, title, text, readmore)});
    });



// Instead of using a selector, define the gallery elements
    const myGallery = GLightbox({
        //todo:don't pass background items
        elements: slide_list,

        touchNavigation: true,
        loop: false,
        openEffect: "fade",
        closeEffect: "fade",
        autoplayVideos: false,
        slideEffect: "slide",
        width:"auto",
        height: "auto",
        closeButton: true,
        keyboardNavigation: true,
        closeOnOutsideClick: true,
        draggable:false,
        // draggable:true,
        // dragToleranceX:5,
        slideHTML: customSlideHTML

    });



    timeline.on("select", function (properties) {

        // selectCounter ++;
        // setSelectCounter(selectCounter);
        var selected_items = properties.items;
        timeline.redraw();
        if(selected_items.length==0){
            // custom_fit_timeline(document.body.clientWidth);
            console.log("deselected");
        } else {
            timeline.focus(selected_items[0],{zoom:false});
            currentTimelineItemIndex = selected_items[0];
            console.log(currentTimelineItemIndex);
            adjust_navigation_opacity(selected_items[0]);
            setTimeout(function(){
                // router.updateURL('test');
                myGallery.openAt(selected_items[0]);
            }, 1000);


        }

        timeline.redraw();
    });

    timeline.on("click", function (properties) {
        //smoothly scroll the timeline into view
        var elmnt = document.getElementById("timeline_viz");
        elmnt.scrollIntoView({behavior: "smooth", block: "center"});
    });




    myGallery.on('slide_before_change', ({ prev, current }) => {

        console.log('Prev slide', prev);
        console.log('Current slide', current);
        change_selected_timeline_item(current.slideIndex);
        currentTimelineItemIndex=current.slideIndex;


    });


    myGallery.on('open', () => {
        // console.log('open');
    });

    myGallery.on('close', () => {
        // console.log('close');
    });

    myGallery.on('slide_changed', () => {
        // console.log('slide_changed');
    });

    myGallery.on('slide_before_load', () => {
        // console.log('slide_before_load');
    });

    myGallery.on('slide_after_load', () => {
        // console.log('slide_after_load');
    });


    function setSelectCounter(count) {
        var counter= document.getElementById("selectCounter");
        counter.innerHTML = "selectCounter=" + count;
    }

    function scrollToSlides() {
        var elmnt = document.getElementById("slides");
        // var elmnt = document.getElementsByClassName("slides");
        elmnt.scrollIntoView({behavior: "smooth"});
    }


    change_selected_timeline_item(currentTimelineItemIndex);
}

create_sct();

