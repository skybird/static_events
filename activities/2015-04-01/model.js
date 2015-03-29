var models = [
    {bg:'da7d54',profit4choice1:20,profit4choice2:0,profit4choice3:0,profit4choice4:20,qText1:'赚了3块',qText2:'亏了3块',qText3:'赔了4块',qText4:'又把鸡买回来了'},

    {bg:'002f58',profit4choice1:0,profit4choice2:0,profit4choice3:20,profit4choice4:20,qText1:'60元',qText2:'80元',qText3:'90元',qText4:'110元'},

    {bg:'535353',profit4choice1:0,profit4choice2:0,profit4choice3:20,profit4choice4:20,qText1:'37瓶',qText2:'39瓶',qText3:'40瓶',qText4:'小明是要喝水自杀吗?'},

    {bg:'db6c6c',profit4choice1:0,profit4choice2:0,profit4choice3:20,profit4choice4:20,qText1:'小明那里',qText2:'爸妈其中一人手里',qText3:'根本没有这10块钱',qText4:'反正不在我这里'},

    {bg:'487f9b',profit4choice1:0,profit4choice2:20,profit4choice3:0,profit4choice4:20,qText1:'现得1000元现金',qText2:'丢骰子，出6时得1万2',qText3:'抛硬币，猜正确赢三千',qText4:'果断选择离职'},

    {bg:'02816d',profit4choice1:0,profit4choice2:20,profit4choice3:0,profit4choice4:20,qText1:'14人',qText2:'15人',qText3:'16人',qText4:'管他又多少人，先抢!'},

];

function getProfitLevel(profit){
    if(profit>=120){
        return {
            iq:140,
            p:96,
            title : '你的智商已经站在人类的巅峰，你就是当代的霍金，再世的爱因斯坦。望你少玩手机，多多爱惜自己的身体，有空多为人类做做贡献。',
            shareMsg:'望你少玩手机，有空多为人类做做贡献。'
        }
    }

    if(profit>=100){
        return {
            iq:120,
            p:82,
            title : '你上知天文下知地理，富五无五车才高八斗。小学数学题对你来说算什么，so easy！妈妈从来就没有担心过你的学习。',
            shareMsg:'小学数学so easy！妈妈从来就没有过你的学习。'
        }
    }

    if(profit>=80){
        return {
            iq:100,
            p:63,
            title : '而且甩出了小布什八条大街。恭喜你在愚人节你捍卫了人类智商的尊严，送你一包辣条压压惊。',
            shareMsg:'你在愚人节捍卫了人类智商的尊严。'
        }
    }

    if(profit>=60){
        return {
            iq:80,
            p:33,
            title : '你有99%的汗水，可就没有1%的天赋。再多的三鹿成长奶粉也拯救不了你，骚年不哭，送你一本《IQ博士》，如若修炼成功，必能翻身重新做人。',
            shareMsg:'骚年不哭，就喜欢你的呆萌'
        }
    }

    if(profit>=40){
        return {
            iq:65,
            p:15,
            title : '整条街的智商都被你拉低了。愚人节就是专门为你而设，在这里祝贺你节日快乐，送你一本《算数一年级》，拿好不谢。',
            shareMsg:'整条街的智商都被你拉低了'
        }
    }

    return {
        iq:50,
        p:2,
        title : '你的脑袋里装的是一块石头吗？地球很危险滴，赶快会火星去吧。',
        shareMsg:'地球很危险滴，赶快会火星去吧'
    }

}

var stat = {
    profit:[]
}

