import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 - 座位表生成器",
  description: "座位表生成器的隐私政策。",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">隐私政策</h1>
      <div className="prose prose-gray text-sm text-gray-600 space-y-4">
        <p>最后更新日期：2026年4月7日</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">数据收集</h2>
        <p>
          座位表生成器是一款完全在浏览器端运行的工具。您输入的所有学生姓名和座位数据仅保存在您的浏览器中，不会上传到任何服务器。
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">Cookie 与分析</h2>
        <p>
          本网站使用 Google AdSense 提供广告服务，可能会使用 Cookie 来提供个性化广告。您可以通过浏览器设置管理 Cookie 偏好。
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">第三方服务</h2>
        <p>
          本网站使用 Google AdSense 广告服务。Google 可能会收集和使用数据以提供相关广告。详情请参阅 Google 的隐私政策。
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">联系我们</h2>
        <p>如果您对本隐私政策有任何疑问，请通过 ToolboxLite 网站联系我们。</p>
      </div>
      <div className="mt-8">
        <a href="/" className="text-sm text-teal-600 hover:text-teal-800">
          &larr; 返回座位表生成器
        </a>
      </div>
    </main>
  );
}
