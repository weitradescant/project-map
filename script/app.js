$(function(){
	let success = 0;
	$.ajax({
		url: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js",  //异步加载KO
		dataType: "script"
	}).done(ifstart)
	.fail(function() {
		alert("加载knockoutJS失败");
	});

	$.ajax({
		url: "http://webapi.amap.com/maps?v=1.4.4&key=22197708df30b23a9631ef14cab27c06", //异步加载高德地图
		dataType: "script"		
	}).done(ifstart)
	.fail(function() {
		alert("加载高德地图失败");
	});

	$.ajax({
		url: "http://webapi.amap.com/ui/1.0/main-async.js", //异步加载高德UI库API
		dataType: "script"		
	}).done(ifstart)
	.fail(function() {
		alert("加载高德UI库失败");
	});

	function ifstart() {
		if (success === 2) {   //已加载完三个 开始执行
			init();	
		} else {
			console.log("还剩" + (2 - success));//测试用
			success++;
		};
	};
});

function init() {
	initAMapUI(); //调用initAMapUI初始化
	let initial = 0;  //计数 第一次
	let locations = [   //默认自定义的坐标数据
		{title: "东方明珠", location: [121.499809,31.239666], address: "世纪大道1号(近二号线陆家嘴站)"},				
		{title: "上海海洋水族馆", location: [121.50195,31.240747], address: "陆家嘴环路1388号"},
		{title: "外滩", location: [121.490602,31.237767], address: "中山东一路"},
		{title: "上海国际会议中心", location: [121.496723,31.239398], address: "滨江大道2727号"},
		{title: "陆家嘴-地铁站", location: [121.502272,31.238183], address: "2号线;(在建)14号线"},
		{title: "外滩观光隧道", location: [121.497238,31.238146], address: "滨江大道2789号外滩观光隧道B2层(近上海国际会议中心)"},
		{title: "正大广场", location: [121.499198,31.236862], address: "陆家嘴西路168号"},
		{title: "麦当劳(陆家嘴明珠环店)", location: [121.501775,31.238668], address: "世纪大道55号2层"},
		{title: "味千拉面(陆家嘴环路分店)", location: [121.501126,31.239667], address: "陆家嘴环路1416号(近东方明珠)"},
		{title: "避风塘(正大广场)", location: [121.498857,31.236374], address: "陆家嘴西路168号正大广场8层"},		
	];

	const map = new AMap.Map("container",{    //载入高德地图
		resizeEnable: true,
		zoom: 17,
		center: [121.499809,31.239666]  //东方明珠坐标
	}); 
	map.on("click",cancelall);    //点击地图会取消弹窗和标记跳动
	map.plugin(["AMap.ToolBar"], function() {  //工具条
		map.addControl(new AMap.ToolBar());
	});
	let markers = [];     //添加标记
	let infowindow = new AMap.InfoWindow({
		closeWhenClickMap: true
	});    //信息窗口

	const ViewModel = function() {                 //knockout
		var that = this;
		that.locationlist = ko.observableArray(locations);  //定义列表项数组
		that.listclick = function(clickedlist) {
			console.log(this);
			for (let i = 0; i < locations.length; i++) {
				if (locations[i] === clickedlist) {
					nmarkerClick(markers[i]);
					break;
				};
			};
		};
		that.removeLC = function() {
			that.locationlist.remove(this);
			resetmarkers();
		};
		that.removeall = function() {
			that.locationlist.removeAll();
		};
	};

	function poipicker() {    //高德输入框选择api
		AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
			var poiPicker = new PoiPicker({
				city:'上海',
				input: 'picker'
			});
			//初始化poiPicker
			poiPickerReady(poiPicker);
		});

		function poiPickerReady(poiPicker) {
			window.poiPicker = poiPicker;
			//选取了某个POI
			poiPicker.on('poiPicked', function(poiResult) {
				let poi = poiResult.item;
				let newlocation = {
					title: poi.name,
					location: poi.location,
					address: poi.address
				}
				locations.push(newlocation);   //数据添加到数组,KO监控数组不更新列表栏
				//console.log(locations);      //验证添加是没问题的
				resetmarkers();
				nmarkerClick(markers[markers.length-1]);
			});
		};
	};

	function nmarkerClick(marker) {   //非直接点击标记触发标记事件
		cancelall();
		infowindow.setContent(marker.content);
		infowindow.open(map,marker.getPosition());
		marker.setAnimation('AMAP_ANIMATION_BOUNCE');
	};

	function markerClick(e) {   //点击标记事件 给予动画和弹窗
		cancelall();
		infowindow.setContent(e.target.content);
		infowindow.open(map,e.target.getPosition());
		this.setAnimation('AMAP_ANIMATION_BOUNCE');
	};

	function cancelall() {  //取消所有标记效果  应用于点击其他标签或地图时
		for (const marker of markers) {
			marker.setAnimation('AMAP_ANIMATION_NONE');  //取消动画
			infowindow.close();    //关闭弹窗
		};
	};

	function resetmarkers() {
		clearall();  //直接清空所有标记
		for (let i = 0; i < locations.length; i++) {  //添加标记
			let marker = new AMap.Marker({
				position: locations[i].location,
				map: map,
				title: locations[i].title
			});
			markers.push(marker);
			marker.content = "这里是: " + locations[i].title + "<br>地址为: " + locations[i].address;   //信息窗口的信息
			marker.on("click",markerClick);    //监听标记事件
			extend();
			if (initial === 0) {
				marker.setAnimation('AMAP_ANIMATION_DROP');			
			};
		};
		initial = 1;
	};

	function clearall() {   //删除所有标记
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		};
		markers = [];
	};

	function extend() {   //自适应标记全屏地图
		map.setFitView();
	};

	function once() {   //初始化时执行一次的动作
		$("#clearall").click(clearall); 
		poipicker();
		resetmarkers();
	};

	once();
	ko.applyBindings(new ViewModel());
};