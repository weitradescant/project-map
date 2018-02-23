$(function(){
	init();
});

function init() {
	const locations = [   //坐标
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

	const map = new AMap.Map("container",{    //载入高德地图
		resizeEnable: true,
		zoom: 16,
		center: [121.499809,31.239666]  //东方明珠坐标
	}); 

	map.plugin(["AMap.ToolBar"], function() {  //工具条
		map.addControl(new AMap.ToolBar());
	});
	map.on("click",cancelall);
	let markers = [];     //添加标记
	let infowindow = new AMap.InfoWindow();    //信息窗口



	for (let i = 0; i < locations.length; i++) {  //添加标记
		let marker = new AMap.Marker({
			position: locations[i].location,
			map: map,
			title: locations[i].title
		});
		markers.push(marker);
		marker.content = "这里是" + locations[i].title;;   //信息窗口的信息
		marker.setAnimation('AMAP_ANIMATION_DROP');  //掉落效果
		marker.on("click",markerClick);    //监听标记事件
	};
	$("#clearall").click(clearall);
	poipicker();


	function poipicker() {
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

	        let marker = new AMap.Marker();

	        let infoWindow = new AMap.InfoWindow({
	            offset: new AMap.Pixel(0, -20)
	        });

	        //选取了某个POI
	        poiPicker.on('poiPicked', function(poiResult) {

	            const source = poiResult.source,
	                poi = poiResult.item,
	                info = {
	                    source: source,
	                    id: poi.id,
	                    name: poi.name,
	                    location: poi.location.toString(),
	                    address: poi.address
	                };

	            marker.setMap(map);
	            infoWindow.setMap(map);

	            marker.setPosition(poi.location);
	            infoWindow.setPosition(poi.location);
	            markers.push(marker);

	            infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
	            infoWindow.open(map, marker.getPosition());

	            //map.setCenter(marker.getPosition());
	        });

	        poiPicker.onCityReady(function() {
	            poiPicker.suggest('游玩');
	        });
	    }
	};


	function markerClick(e) {   //点击标记事件
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
	}

	function clearall() {   //删除所有标记
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		};
		markers = [];

	};

	function extend() {   //自适应标记全屏地图
		map.setFitView();
	};



	const ViewModel = function() {
		const that = this;
		this.lbx = ko.observableArray([]);  //定义列表项数组
		locations.forEach(function(data) {
			that.lbx.push(data);
		})

		//this.currentList = ko.observable(new List({}));
	};

	const List = function() {   //model;
		//this.listname = ko.observableArray(['1','2'])
	};

	ko.applyBindings(new ViewModel());
};