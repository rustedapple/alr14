/**
 * Module that registers the simple Home functionality
 */
var Home = {
	// times in (minutes * seconds * milliseconds)
	_EXPLORE_COOLDOWN: 1, // cooldown to 
	_FEED_COOLDOWN: 1, // cooldown to 
	_EXPAND_COOLDOWN: 1, // cooldown to 
	
	buttons:{},

	name: _("Home"),
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);

		if(Engine._debug) {
			this._EXPLORE_COOLDOWN = 0;
			this._FEED_COOLDOWN = 0;
			this._EXPAND_COOLDOWN = 0;
		}

		if(typeof $SM.get('features.location.home') == 'undefined') {
			var prestige = Prestige.get();
			//window.State = {};
			localStorage.clear();
			Prestige.set(prestige);

			$SM.setIncome('flying', {
				delay: 1,
				stores: {'distance' : 0 }
			});

			$SM.setIncome('babyBirdHealth', {
				delay: 1,
				stores: {'babyBirdHealth' : 0 }
			});

			$SM.set('features.location.home', true);
			$SM.set('features.location.outside', true);
			$SM.set('game.babyBirdHealth.level', -1);
			$SM.set('game.temperature', 0);
			$SM.set('stores.babyBirdHealth', 0);
			$SM.set('stores.food', 1);
			$SM.set('stores.distance', 0);



			//Engine.deleteSave();
		}
		
		// Create the Home tab
		this.tab = Header.addLocation(_("Base"), "Home", Home);
		
		// Create the Home panel
		this.panel = $('<div>')
			.attr('id', "HomePanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		Engine.updateSlider();
		
		// Hatch Egg
		new Button.Button({
			id: 'hatchButton',
			text: _("Hatch Egg"),
			click: Home.hatchEgg,
			//cooldown: Home._EXPLORE_COOLDOWN,
			width: '80px',
		}).appendTo('div#HomePanel');
		
		// Create the stores container
		$('<div>').attr('id', 'storesContainer').prependTo('div#HomePanel');
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Home.handleStateUpdates);
		
		Home.updateButton();
		Home.updateStoresView();
		Home.updateIncomeView();
		Home.updateBuildButtons();
		
		Engine.setTimeout($SM.collectIncome, 100);

		if(Home.changed) {
			Home.changed = false;
		}
	},
	
	options: {}, // Nothing for now
	
	setTitle: function() {
		var title = $SM.get('game.fire.value') < 2 ? _("A Dark Home") : _("A Firelit Home");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_Home').text(title);
	},

	onArrival: function(transition_diff) {
		Home.setTitle();
		if(Home.changed) {
			Home.changed = false;
		}
		if($SM.get('game.babyBirdHealth.level') == 3) {

			
			Home.updateIncomeView();
			Notifications.notify(Home, _("the stranger is standing by the fire. she says she can help. says she builds things."));
		}

		Engine.moveStoresView(null, transition_diff);
	},
	
	updateButton: function() {
		var explore = $('#exploreButton.button');
		var feed = $('#feedButton.button');

		//Notifications.notify(Home, _("the stranger is standing by the fire. she says she can help. says she builds things."));
		//explore.hide();
		//feed.hide();
		// if($SM.get('game.fire.value') == Room.FireEnum.Dead.value && stoke.css('display') != 'none') {
		// 	stoke.hide();
		// 	light.show();
	
		// if(!$SM.get('stores.food')) {
		// 	feed.addClass('free');
		// 	explore.addClass('free');
		// } else {
		// 	feed.removeClass('free');
		// 	explore.removeClass('free');
		// }
	},

	leaveNest: function() {
		if($SM.get('game.temperature') != 1) {
			$SM.set('game.temperature', 1);
			//$SM.set('game.babyBirdHealth.level', -1);
			Outside.init();
		}

		Engine.travelTo(Outside);
		$SM.set('stores.distance', 1);
	},

	feed: function() {
		var food = $SM.get('stores.food');
		var babyBirdHealth = $SM.get('stores.babyBirdHealth');
		if(food === 0) {
			Notifications.notify(Home, _("no food"));
			Button.clearCooldown($('#feedButton.button'));
			return;
		}
		if(food > 0) {
			$SM.set('stores.food', food - 1);
			if (babyBirdHealth > 90) {
				$SM.set('stores.babyBirdHealth', 100);
			}
			else {
				$SM.set('stores.babyBirdHealth', babyBirdHealth + 10);				
			}
		}
	},

	hatchEgg: function() {
		var hatchEggButton = $('#hatchButton.button');

		// Leave Nest
		new Button.Button({
			id: 'exploreButton',
			text: _("Leave Nest"),
			click: Home.leaveNest,
			cooldown: Home._EXPLORE_COOLDOWN,
			width: '80px',
		}).appendTo('div#HomePanel');

		// Feed baby chickpeas
		new Button.Button({
			id: 'feedButton',
			text: _("Feed Baby Chickpeas"),
			click: Home.feed,
			cooldown: Home._FEED_COOLDOWN,
			width: '80px',
			cost: {'food': 1}
		}).appendTo('div#HomePanel');

		$SM.setIncome('babyBirdHealth', {
				delay: 1,
				stores: {'babyBirdHealth' : -1 }
			});

		$SM.set('stores.babyBirdHealth', 80);

		hatchEggButton.hide();
	},
	
	adjustTemp: function() {
		var old = $SM.get('game.temperature.value');
		if($SM.get('game.temperature.value') > 0 && $SM.get('game.temperature.value') > $SM.get('game.fire.value')) {
			$SM.set('game.temperature',Home.TempEnum.fromInt($SM.get('game.temperature.value') - 1));
			Notifications.notify(Home, _("the Home is {0}" , Home.TempEnum.fromInt($SM.get('game.temperature.value')).text), true);
		}
		if($SM.get('game.temperature.value') < 4 && $SM.get('game.temperature.value') < $SM.get('game.fire.value')) {
			$SM.set('game.temperature', Home.TempEnum.fromInt($SM.get('game.temperature.value') + 1));
			Notifications.notify(Home, _("the Home is {0}" , Home.TempEnum.fromInt($SM.get('game.temperature.value')).text), true);
		}
		if($SM.get('game.temperature.value') != old) {
			Home.changed = true;
		}
		Home._tempTimer = Engine.setTimeout(Home.adjustTemp, Home._Home_WARM_DELAY);
	},
	
	updateStoresView: function() {
		var stores = $('div#stores');
	  var resources = $('div#resources');
		var special = $('div#special');
		var weapons = $('div#weapons');
		var needsAppend = false, rNeedsAppend = false, sNeedsAppend = false, wNeedsAppend = false, newRow = false;
		if(stores.length === 0) {
			stores = $('<div>').attr({
				'id': 'stores',
				'data-legend': _('stores')
			}).css('opacity', 0);
			needsAppend = true;
		}
		if(resources.length === 0) {
			resources = $('<div>').attr({
				id: 'resources'
			}).css('opacity', 0);
			rNeedsAppend = true;
		}
		if(special.length === 0) {
			special = $('<div>').attr({
				id: 'special'
			}).css('opacity', 0);
			sNeedsAppend = true;
		}
		if(weapons.length === 0) {
			weapons = $('<div>').attr({
				'id': 'weapons',
				'data-legend': _('weapons')
			}).css('opacity', 0);
			wNeedsAppend = true;
		}
		for(var k in $SM.get('stores')) {
			
			var type = null;
			
			var location;
			switch(type) {
			case 'upgrade':
				// Don't display upgrades on the Home screen
				continue;
			case 'weapon':
				location = weapons;
				break;
			case 'special':
				location = special;
				break;
			default:
				location = resources;
				break;
			}
			
			var id = "row_" + k.replace(' ', '-');
			var row = $('div#' + id, location);
			var num = $SM.get('stores["'+k+'"]');
			
			if(typeof num != 'number' || isNaN(num)) {
				// No idea how counts get corrupted, but I have reason to believe that they occassionally do.
				// Build a little fence around it!
				num = 0;
				$SM.set('stores["'+k+'"]', 0);
			}
			
			var lk = _(k);
			
			// thieves?
			if(typeof $SM.get('game.thieves') == 'undefined' && num > 5000 && $SM.get('features.location.world')) {
				$SM.startThieves();
			}
			
			if(row.length === 0 && num > 0) {
				row = $('<div>').attr('id', id).addClass('storeRow');
				$('<div>').addClass('row_key').text(lk).appendTo(row);
				$('<div>').addClass('row_val').text(Math.floor(num)).appendTo(row);
				$('<div>').addClass('clear').appendTo(row);
				var curPrev = null;
				location.children().each(function(i) {
					var child = $(this);
					var cName = child.children('.row_key').text();
					if(cName < lk) {
						curPrev = child.attr('id');
					}
				});
				if(curPrev == null) {
					row.prependTo(location);
				} else {
					row.insertAfter(location.find('#' + curPrev));
				}
				newRow = true;
			} else if(num>= 0){
				$('div#' + row.attr('id') + ' > div.row_val', location).text(Math.floor(num));
			}
		}
				
		if(rNeedsAppend && resources.children().length > 0) {
			resources.prependTo(stores);
			resources.animate({opacity: 1}, 300, 'linear');
		}
		
		if(sNeedsAppend && special.children().length > 0) {
			special.appendTo(stores);
			special.animate({opacity: 1}, 300, 'linear');
		}
		
		if(needsAppend && stores.find('div.storeRow').length > 0) {
			stores.appendTo('div#storesContainer');
			stores.animate({opacity: 1}, 300, 'linear');
		}
		
		if(wNeedsAppend && weapons.children().length > 0) {
			weapons.appendTo('div#storesContainer');
			weapons.animate({opacity: 1}, 300, 'linear');
		}
		
		//if(newRow) {
			Home.updateIncomeView();
		//}/

		if($SM.get('stores.compass') && !Home.pathDiscovery){
			Home.pathDiscovery = true;
			Path.openPath();
		}
	},
	
	updateIncomeView: function() {
		var stores = $('div#resources');
		var totalIncome = {};
		if(stores.length === 0 || typeof $SM.get('income') == 'undefined') return;
		$('div.storeRow', stores).each(function(index, el) {
			el = $(el);
			$('div.tooltip', el).remove();
			var tt = $('<div>').addClass('tooltip bottom right');
			var storeName = el.attr('id').substring(4).replace('-', ' ');
			for(var incomeSource in $SM.get('income')) {
				var income = $SM.get('income["'+incomeSource+'"]');
				for(var store in income.stores) {
					if(store == storeName && income.stores[store] !== 0) {
						$('<div>').addClass('row_key').text(_(incomeSource)).appendTo(tt);
						$('<div>')
							.addClass('row_val')
							.text(Engine.getIncomeMsg(income.stores[store], income.delay))
							.appendTo(tt);
						if (!totalIncome[store] || totalIncome[store].income === undefined) {
							totalIncome[store] = { income: 0 };
						}
						totalIncome[store].income += Number(income.stores[store]);
						totalIncome[store].delay = income.delay;
					}
				}
			}
			if(tt.children().length > 0) {
				var total = totalIncome[storeName].income;
				$('<div>').addClass('total row_key').text(_('total')).appendTo(tt);
				$('<div>').addClass('total row_val').text(Engine.getIncomeMsg(total, totalIncome[storeName].delay)).appendTo(tt);
				tt.appendTo(el);
			}
		});
	},
	
	buy: function(buyBtn) {
		var thing = $(buyBtn).attr('buildThing');
		var good = Home.TradeGoods[thing];
		var numThings = $SM.get('stores["'+thing+'"]', true);
		if(numThings < 0) numThings = 0;
		if(good.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = good.cost();
		for(var k in cost) {
			var have = $SM.get('stores["'+k+'"]', true);
			if(have < cost[k]) {
				Notifications.notify(Home, _("not enough " + k));
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		$SM.setM('stores', storeMod);
		
		Notifications.notify(Home, good.buildMsg);
		
		$SM.add('stores["'+thing+'"]', 1);
	},
	
	build: function(buildBtn) {
		var thing = $(buildBtn).attr('buildThing');
		if($SM.get('game.temperature.value') <= Home.TempEnum.Cold.value) {
			Notifications.notify(Home, _("babyBirdHealth just shivers"));
			return false;
		}
		var craftable = Home.Craftables[thing];
		
		var numThings = 0; 
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'tool':
		case 'upgrade':
			numThings = $SM.get('stores["'+thing+'"]', true);
			break;
		case 'building':
			numThings = $SM.get('game.buildings["'+thing+'"]', true);
			break;
		}
		
		if(numThings < 0) numThings = 0;
		if(craftable.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = craftable.cost();
		for(var k in cost) {
			var have = $SM.get('stores["'+k+'"]', true);
			if(have < cost[k]) {
				Notifications.notify(Home, _("not enough "+k));
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		$SM.setM('stores', storeMod);
		
		Notifications.notify(Home, craftable.buildMsg);
		
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'upgrade':
		case 'tool':
			$SM.add('stores["'+thing+'"]', 1);
			break;
		case 'building':
			$SM.add('game.buildings["'+thing+'"]', 1);
			break;
		}		
	},
	
	needsWorkshop: function(type) {
		return type == 'weapon' || type == 'upgrade' || type =='tool';
	},
	
	buyUnlocked: function(thing) {
		if(Home.buttons[thing]) {
			return true;
		} else if($SM.get('game.buildings["trading post"]', true) > 0) {
			if(thing == 'compass' || typeof $SM.get('stores["'+thing+'"]') != 'undefined') {
				// Allow the purchase of stuff once you've seen it
				return true;
			}
		}
		return false;
	},
	
	updateBuildButtons: function() {
		var buildSection = $('#buildBtns');
		var needsAppend = false;
		if(buildSection.length === 0) {
			buildSection = $('<div>').attr({'id': 'buildBtns', 'data-legend': _('build:')}).css('opacity', 0);
			needsAppend = true;
		}
		
		var craftSection = $('#craftBtns');
		var cNeedsAppend = false;
		if(craftSection.length === 0 && $SM.get('game.buildings["workshop"]', true) > 0) {
			craftSection = $('<div>').attr({'id': 'craftBtns', 'data-legend': _('craft:')}).css('opacity', 0);
			cNeedsAppend = true;
		}
		
		var buySection = $('#buyBtns');
		var bNeedsAppend = false;
		if(buySection.length === 0 && $SM.get('game.buildings["trading post"]', true) > 0) {
			buySection = $('<div>').attr({'id': 'buyBtns', 'data-legend': _('buy:')}).css('opacity', 0);
			bNeedsAppend = true;
		}
		
		for(var k in Home.Craftables) {
			craftable = Home.Craftables[k];
			var max = $SM.num(k, craftable) + 1 > craftable.maximum;
			if(craftable.button == null) {
				if(Home.craftUnlocked(k)) {
					var loc = Home.needsWorkshop(craftable.type) ? craftSection : buildSection;
					craftable.button = new Button.Button({
						id: 'build_' + k,
						cost: craftable.cost(),
						text: _(k),
						click: Home.build,
						width: '80px',
						ttPos: loc.children().length > 10 ? 'top right' : 'bottom right'
					}).css('opacity', 0).attr('buildThing', k).appendTo(loc).animate({opacity: 1}, 300, 'linear');
				}
			} else {
				// refresh the tooltip
				var costTooltip = $('.tooltip', craftable.button);
				costTooltip.empty();
				var cost = craftable.cost();
				for(var k in cost) {
					$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
					$("<div>").addClass('row_val').text(cost[k]).appendTo(costTooltip);
				}
				if(max && !craftable.button.hasClass('disabled')) {
					Notifications.notify(Home, craftable.maxMsg);
				}
			}
			if(max) {
				Button.setDisabled(craftable.button, true);
			} else {
				Button.setDisabled(craftable.button, false);
			}
		}
		
		for(var k in Home.TradeGoods) {
			good = Home.TradeGoods[k];
			var max = $SM.num(k, good) + 1 > good.maximum;
			if(good.button == null) {
				if(Home.buyUnlocked(k)) {
					good.button = new Button.Button({
						id: 'build_' + k,
						cost: good.cost(),
						text: _(k),
						click: Home.buy,
						width: '80px'
					}).css('opacity', 0).attr('buildThing', k).appendTo(buySection).animate({opacity:1}, 300, 'linear');
				}
			} else {
				// refresh the tooltip
				var costTooltip = $('.tooltip', good.button);
				costTooltip.empty();
				var cost = good.cost();
				for(var k in cost) {
					$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
					$("<div>").addClass('row_val').text(cost[k]).appendTo(costTooltip);
				}
				if(max && !good.button.hasClass('disabled')) {
					Notifications.notify(Home, good.maxMsg);
				}
			}
			if(max) {
				Button.setDisabled(good.button, true);
			} else {
				Button.setDisabled(good.button, false);
			}
		}
		
		if(needsAppend && buildSection.children().length > 0) {
			buildSection.appendTo('div#HomePanel').animate({opacity: 1}, 300, 'linear');
		}
		if(cNeedsAppend && craftSection.children().length > 0) {
			craftSection.appendTo('div#HomePanel').animate({opacity: 1}, 300, 'linear');
		}
		if(bNeedsAppend && buildSection.children().length > 0) {
			buySection.appendTo('div#HomePanel').animate({opacity: 1}, 300, 'linear');
		}
	},
	
	compassTooltip: function(direction){
		var tt = $('<div>').addClass('tooltip bottom right');
		$('<div>').addClass('row_key').text(_('the compass points '+ direction)).appendTo(tt);
		tt.appendTo($('#row_compass'));
	},
	
	handleStateUpdates: function(e){
		if(e.category == 'stores'){
			Home.updateStoresView();
			Home.updateBuildButtons();
		} else if(e.category == 'income'){
			Home.updateStoresView();
			Home.updateIncomeView();
		} else if(e.stateName.indexOf('game.buildings') === 0){
			Home.updateBuildButtons();
		}
	}
};
