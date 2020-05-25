# WordPressNodeProxyServer


> [通过NodeJS服务器将Posts文章代理转发到WordPress博客网站学习记录](https://blog.csdn.net/u010309137/article/details/105670792)

### 项目记录使用通过Node服务器代理转发请求到WordPress网站
* 提供使用Node方式的XMLRPC使用思路。  
* 代码比较简陋，仅供研究学习交流。  
* 主要代码已加上注释说明，可参见代码片段。

### 已实现功能：
- 代理发布文章
- 代理更新文章
- 代理上传图片

# 常用接口xml参数
## 1、删除文章
~~~xml
<?xml version="1.0"?>
<methodCall>
	<methodName>
		wp.deletePost
	</methodName>
	<params>
		<param>
			<value>
				<int>
					0<!--官方未使用-->
				</int>
			</value>
		</param>
		<param>
			<value>
				<string>
					account@domain.com
				</string>
			</value>
		</param>
		<param>
			<value>
				<string>
					mypassword
				</string>
			</value>
		</param>
		<param>
			<value>
				<int>10</int><!--文章ID-->
			</value>
		</param>
	</params>
</methodCall>
~~~
## 2、获取单个已发布文章
~~~xml
<?xml version="1.0"?>
<methodCall>
	<methodName>
		wp.getPost
	</methodName>
	<params>
		<param>
			<value>
				<int>
					0<!--官方未使用-->
				</int>
			</value>
		</param>
		<param>
			<value>
				<string>
					account@domain.com
				</string>
			</value>
		</param>
		<param>
			<value>
				<string>
					mypassword
				</string>
			</value>
		</param>
		<param>
			<value>
				<int>10</int><!--文章ID-->
			</value>
		</param>
	</params>
</methodCall>
~~~

## 3、获取已发布文章列表
> 参见 [WordPress - wp_getposts](https://developer.wordpress.org/reference/classes/wp_xmlrpc_server/wp_getposts/)

~~~xml
<?xml version="1.0"?>
<methodCall>
	<methodName>
		wp.getPosts
	</methodName>
	<params>
		<param>
			<value>
				<int>
					0<!--官方未使用-->
				</int>
			</value>
		</param>
		<param>
			<value>
				<string>
					account@domain.com
				</string>
			</value>
		</param>
		<param>
			<value>
				<string>
					mypassword
				</string>
			</value>
		</param>
		<param>
			<value>
				<struct>
					
					<member>
						<name>number</name>
                        <value>
                            <int>1</int><!--分页数量-->
                        </value>
					</member>
					<member>
						<name>offset</name>
                        <value>
                            <int>1</int><!--分页偏移量-->
                        </value>
					</member>
                    <member>
                        <name>post_type</name>
                        <value>
                            <string>post</string>
                        </value>
                    </member>
					<member>
						<name>post_status</name>
                        <value>
                            <string>publish</string>
                        </value>
					</member>
				</struct>
			</value>
		</param>
	</params>
</methodCall>
~~~