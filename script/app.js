$(function(){
	init()
/*
	AMap.plugin(['AMap.ToolBar','AMap.AdvancedInfoWindow'],function(){
    //创建并添加工具条控件
	    var toolBar = new AMap.ToolBar();
	    map.addControl(toolBar);
	    //创建高级信息窗体并在指定位置打开
	    var infowindow = new AMap.AdvancedInfoWindow({
	      content: '<div class="info-title">高德地图</div><div class="info-content">'+
	            '<img src="http://webapi.amap.com/images/amap.jpg">'+
	            '高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。<br></div>',
	      offset: new AMap.Pixel(0, -30)
	    });
	    infowindow.open(map,[121.49972, 31.23969]);
	})
	*/
});

function init() {   //载入高德地图
	const map = new AMap.Map("container",{
		resizeEnable: true,
		zoom: 16,
		center: [121.499809,31.239666]  //东方明珠坐标
	}); 

	map.plugin(["AMap.ToolBar"], function() {  //工具条
		map.addControl(new AMap.ToolBar());
	});

	let markers = [];
	let infowindow = new AMap.InfoWindow();
	const locations = [
		{title: "东方明珠", location: [121.499809,31.239666]},				
		{title: "上海海洋水族馆", location: [121.50195,31.240747]},
		{title: "外滩", location: [121.490602,31.237767]},
		{title: "上海国际会议中心", location: [121.496723,31.239398]},
		{title: "陆家嘴-地铁站", location: [121.502272,31.238183]},
		{title: "外滩观光隧道", location: [121.497238,31.238146]},
		{title: "正大广场", location: [121.499198,31.236862]},
		{title: "麦当劳餐厅", location: [121.501775,31.238668]},
		{title: "味千拉面", location: [121.501126,31.239667]},
		{title: "避风塘", location: [121.498857,31.236374]},		
	];
	for (let i = 0; i < locations.length; i++) {  //添加标记
		let marker = new AMap.Marker({
			position: locations[i].location,
			map: map,
			title: locations[i].title
		});
		markers.push(marker);
		marker.content = "这里是" + locations[i].title;;
		marker.setAnimation('AMAP_ANIMATION_DROP');  //掉落效果
		marker.on("click",markerClick);    //监听标记事件
	};
	

	function markerClick(e) {   //点击出现弹窗介绍
		infowindow.setContent(e.target.content);
		infowindow.open(map,e.target.getPosition());
	};

	$("#showall").click(showall);
	$("#hideall").click(hideall);
	function showall() {    //显示所有标记
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
		extend();
	};

	function hideall() {   //删除所有标记
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	};

	function extend() {   //自适应标记全屏地图
		map.setFitView();
	};
};

const ViewModel = function() {
	3
};

const Views = function() {
	2
};

const Model = function() {
	1
};

ko.applyBindings(new ViewModel());