$(function () {
    // $(".infoHandle>a").each(function (index,val) {
    //     var $url="url(\"../images/icons.png\") no-repeat 0 "+(index * -17) +"px";
    //     $(this).css("background",$url);
    // })
    $("body").delegate("textarea","propertychange input",function () {
        if($(this).val().length>0)
        {
            $(".send").prop("disabled",false);
        }
        else
        {
            $(".send").prop("disabled",true);
        }
    });
    var pageNum=window.location.hash.substring(1)||1;
    getMessageList(pageNum);
    getPageNum();
    function getMessageList(num)
    {
        $(".messageList").html("");
        $.ajax({
            type:"get",
            url:"weibo.php",
            data:"act=get&page="+num,
            success:function (msg) {
                var res=eval("("+msg+")");
                $.each(res,function (index,obj) {
                    var $info=createEle(obj);
                    $(".messageList").append($info);
                })
            },
            error:function (e) {
                alert(e.status)
            }
        });
    }
    function getPageNum() {
        $(".page").html("");
        $.ajax({
            type:"get",
            url:"weibo.php",
            data:"act=get_page_count",
            success:function (msg) {
                var obj=eval("("+msg+")");
                while (obj.count)
                {
                    var $page=$("<a href=\"javascript:;\">"+obj.count+"</a>");
                    $(".page").prepend($page);
                    if(obj.count===parseInt(pageNum))
                    {
                        $page.addClass("cur");
                    }
                    obj.count-=1;
                }

            },
            error:function (e) {
                alert(e.status)
            }
        });
    }
    function createEle(obj)
    {
        var $time=formateTime(obj.time);
        var $info=$("<div class=\"info\">\n" +
            "            <p class=\"infoText\">"+obj.content+"</p>\n" +
            "            <p class=\"infoOperation\">\n" +
            "                <span class=\"infoTime\">"+$time+"</span>\n" +
            "                <span class=\"infoHandle\">\n" +
            "                        <a href=\"javascript:;\" class='infoTop'>"+obj.acc+"</a>\n" +
            "                        <a href=\"javascript:;\" class='infoDown'>"+obj.ref+"</a>\n" +
            "                        <a href=\"javascript:;\" class='infoDel'>删除</a>\n" +
            "                    </span>\n" +
            "            </p>\n" +
            "        </div>");
        $info.get(0).obj=obj;
        return $info;
    }
    //监听发布按钮点击
    $(".send").click(function () {
        var $text=$("textarea").val();
        // 添加一条微博
        $.ajax({
            type:"get",
            url:"weibo.php",
            data:"act=add&content="+$text,
            success:function (msg) {
                var res=eval("("+msg+")");
                res.content=$text;
                var $info=createEle(res);
                $(".messageList").prepend($info);
                $("textarea").val("");
                if($(".info").length>6)
                {
                    //删除第一条微博的dom
                    $(".info").eq($(".info").length-1).remove();
                }
            },
            error:function (e) {
                alert(e.status);
            }
        });
        getPageNum();
    });
    //监听页码点击
    $("body").delegate(".page>a","click",function () {
        pageNum=$(this).html();
        getMessageList(pageNum);
        $(this).addClass("cur");
        $(this).siblings().removeClass("cur");
        window.location.hash=pageNum;
    });
    //点击顶
    $("body").delegate(".infoTop","click",function () {
        $(this).text(parseInt($(this).text())+1);
        var $id=$(this).parents(".info").get(0).obj.id;
        $.ajax({
            type:"get",
            url:"weibo.php",
            data:"act=acc&id="+$id,
            success:function (msg) {
                console.log(msg);
            },
            error:function (e) {
                alert(e.status);
            }
        })
    });
    //点击踩
    $("body").delegate(".infoDown","click",function () {
        $(this).text(parseInt($(this).text())+1);
        var $id=$(this).parents(".info").get(0).obj.id;
        $.ajax({
            type:"get",
            url:"weibo.php",
            data:"act=ref&id="+$id,
            success:function (msg) {
                console.log(msg);
            },
            error:function (e) {
                alert(e.status);
            }
        })
    });
    //点击删除
    $("body").delegate(".infoDel","click",function () {
        $(this).parents(".info").remove();
        var $id=$(this).parents(".info").get(0).obj.id;
        console.log($(this).parents(".info"));
        $.ajax({
            type:"get",
            url:"weibo.php",
            data:"act=del&id="+$id,
            success:function (msg) {
                if($(".info").length===0)
                {
                    pageNum=(pageNum-1)||1;
                }
                getMessageList(pageNum);
                getPageNum();
            },
            error:function (e) {
                alert(e.status);
            }
        })
    });
    
    function formateTime(time) {
        time=time*1000;
        var oDate=new Date(time);
        var $time=oDate.getFullYear()+"-"+(oDate.getMonth()+1)+"-"+oDate.getDate()+" "+oDate.getHours()+":"+oDate.getMinutes()+":"+oDate.getSeconds();
        // console.log($time);
        return $time;
    }
});