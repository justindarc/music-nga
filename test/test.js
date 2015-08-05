var assert = require('assert');
var sinon = require('sinon');
var path = require('path');
var fs = require('fs');

function include(filePath) {
  eval.call(global, fs.readFileSync(path.normalize(__dirname + '/' + filePath), 'UTF-8'));
}

describe('/js/app.js', function() {
  global.window = {
    performance: {
      mark: sinon.spy()
    },

    requestAnimationFrame: sinon.spy(function(callback) {
      callback();
    })
  };

  global.navigator = {
    serviceWorker: {
      getRegistration: sinon.spy(function() {
        return Promise.resolve();
      })
    }
  };

  global.document = {
    getElementById: sinon.spy(function() {
      return {
        addEventListener: sinon.spy()
      }
    })
  };

  global.threads = {
    service: sinon.spy(function() {
      return {
        on: sinon.spy(function() {
          return {
            listen: sinon.spy()
          };
        })
      };
    }),

    client: sinon.spy(function() {
      return {
        connect: sinon.spy(function() {

        }),
        connected: Promise.resolve()
      };
    })
  };

  include('../js/app.js');

  it('should add "action" event listener on `header`', function() {
    assert.ok(header.addEventListener.calledWith('action'));
  });

  it('should add "click" event listener on `playerButton`', function() {
    assert.ok(playerButton.addEventListener.calledWith('click'));
  });

  it('should add "change" event listener on `viewStack`', function() {
    assert.ok(viewStack.addEventListener.calledWith('change'));
  });

  it('should add "pop" event listener on `viewStack`', function() {
    assert.ok(viewStack.addEventListener.calledWith('pop'));
  });

  it('should add "change" event listener on `tabBar`', function() {
    assert.ok(tabBar.addEventListener.calledWith('change'));
  });

  describe('#setHeaderTitle()', function() {
    before(function() {
      viewStack.activeState = {
        params: {}
      };
    });

    it('should set `viewStack.activeState.params.title` to "foo"', function() {
      setHeaderTitle('foo');
      assert.equal(viewStack.activeState.params.title, 'foo');
    });

    it('should set `headerTitle.textContent` to "foo"', function() {
      setHeaderTitle('foo');
      assert.equal(headerTitle.textContent, 'foo');
    });
  });
});
